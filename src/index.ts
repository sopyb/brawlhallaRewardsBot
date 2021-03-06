import axios from "axios"
import puppeteer, { Page } from "puppeteer"
import * as config from "./config.json"
import Event from "./event"
import Utils from "./utils"

async function updateEvents() {
    //Get today's event list
    let events: Event[] = (await axios
        .get(config.calendar_url)).data.events

    let now: number = Date.now() // time now <.< we need it
    
    //check for events that have passed
    events = events.filter(e => new Date(e.end_dt).getTime() >= now)

    console.log(`Loaded ${events.length} events at ${new Date()}`)

    events.forEach(e => {
        console.log(`* ${e.title} - ${new Date(e.start_dt)}`)

        let startTime = new Date(e.start_dt).getTime() // get start time
        setTimeout(() => {startEvent(e)}, Math.max(startTime - now, 0)) // schedule browser start
    });

    let midnight = new Date()
    midnight.setUTCHours(24, 0, 0, 0)

    setInterval(updateEvents, midnight.getTime() - now)
    
    // startEvent(events[0]) // debugging line DUH!
}

async function startEvent(event: Event) {
    console.log(`Event: ${event.title} is about to begin`)

    //create browser context and goto page
    let browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        userDataDir: Utils.getChromeDataDir(),
        executablePath: Utils.getChromeExecutable()}),
        page = await browser.newPage();

    await page.goto(config.stream_url);

    await page.evaluate(`
        localStorage.setItem('mature', 'true')
        localStorage.setItem('video-muted', '{"default":true}')
        localStorage.setItem('volume', '0.01')
        localStorage.setItem('video-quality', '{"default":"160p30"}')
    `)
    
    await page.reload();

    // click chat button if steam is still yet to start
    await page.$x('//*[@id="root"]/div/div[2]/div[1]/main/div[2]/div[3]/div/div/div[1]/div[1]/div[2]/div/div[2]/div[2]/div/div/ul/li[5]/a/div/div[1]/div')
        .then(e => e[0]?.click())
        .catch(console.log)
    
    // collect channel points
    page.setDefaultTimeout(0)
    waitForPoints(page)

    // check if stream started or refresh the page
    setTimeout(() => {checkStreamStarted(page)}, 60000)

    // schedule end
    let now: number = Date.now()
    setTimeout(() => {browser.close()}, new Date(event.end_dt).getTime() - now)
}

async function checkStreamStarted(page: Page) {
    // big thanks to dortzur - https://stackoverflow.com/questions/41649874/how-to-detect-if-a-chrome-tab-is-playing-audio
    if (await page.evaluate("!Array.prototype.find.call(document.querySelectorAll('audio,video'),function(elem){return elem.duration > 0 && !elem.paused})")) {
        await page.reload()
        
        // click chat button if steam is still yet to start
        await page.$x('//*[@id="root"]/div/div[2]/div[1]/main/div[2]/div[3]/div/div/div[1]/div[1]/div[2]/div/div[2]/div[2]/div/div/ul/li[5]/a/div/div[1]/div')
            .then(e => e[0]?.click())
            .catch(console.log)
        
        setTimeout(() => {checkStreamStarted(page)}, 60000)
    }
}

async function waitForPoints(page: Page) {
    await page.waitForSelector(".ScCoreButtonSuccess-sc-1qn4ixc-5 > div:nth-child(1)", {visible: true})
        .then(async () => (await page.$(".ScCoreButtonSuccess-sc-1qn4ixc-5 > div:nth-child(1)"))?.click())
        .catch(console.error)
    
    waitForPoints(page)
}

//start everything
updateEvents()