import axios from "axios"
import puppeteer from "puppeteer"
import * as config from "./config.json"
import Event from "./event"
import Utils from "./utils"

async function updateEvents() {
    //Get today's event list
    let events: Event[] = (await axios
        .get(config.calendar_url)).data.events

    let now: number = Date.now() // time now <.< we need it

    //check for events that have passed
    events.filter(e => new Date(e.end_dt).getTime() >= now)

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
        executablePath: '/usr/bin/google-chrome-stable'}),
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

    // schedule end
    let now: number = Date.now()
    setTimeout(() => {browser.close()}, new Date(event.end_dt).getTime() - now)
}

//start everything
updateEvents()