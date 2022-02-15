import axios from "axios"
import puppeteer from "puppeteer"
import { existsSync, mkdirSync } from "fs"
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

    events.forEach(e => {
        let startTime = new Date(e.end_dt).getTime() // get start time

        //schedule browser start
        setTimeout(startEvent, Math.max(startTime - now, 0))
    });

    let midnight = new Date()
    midnight.setUTCHours(24, 0, 0, 0)

    setInterval(updateEvents, midnight.getTime() - now)
}

async function startEvent() {
    let browser = await puppeteer.launch({
        headless:false,
        defaultViewport: null,
        userDataDir: Utils.getChromeDataDir()}),
        page = await browser.newPage();
    
    await page.goto(config.stream_url)
}

//start everything
updateEvents()