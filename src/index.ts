import axios from "axios"
import * as config from "./config.json"
import Event from "./event"

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
        midnight.setUTCHours(24,0,0,0)

    setInterval(updateEvents, midnight.getTime() - now)

    console.log(midnight.getTime() - now)
}

async function startEvent() {
    //puppeteer stuff
}

//start everything
updateEvents()