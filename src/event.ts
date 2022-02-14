interface Event {
    id: string,
    series_id: any,
    remote_id: any,
    subcalendar_id: any,
    subcalendar_ids: any[],
    all_day: boolean,
    rrule: string,
    title: string,
    who: string,
    location: string,
    notes: any,
    version: string,
    readonly: boolean,
    tz: string,
    attachments: any[],
    start_dt: string,
    end_dt: string,
    ristart_dt: string,
    rsstart_dt: string,
    creation_dt: string,
    update_dt: string,
    delete_dt: any,
    custom: any
}

export default Event