import axios from "axios"
import * as config from "./config.json"
import Event from "./event"

(async () => {
    let events: Event[] = (await axios
        .get(config.calendar_url)).data.events

    let now: number = Date.now()

    events.filter(e => new Date(e.end_dt).getTime() >= now)

    events.forEach(e => {
        let startTime = new Date(e.end_dt).getTime()
        if (startTime <= now) {
            //open browser
        } else {
            //schedule browser start
            setTimeout(() => {

            }, startTime - now)

            console.log(startTime - now)
        }
    });
})()