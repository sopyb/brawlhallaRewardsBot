import os from "node:os"
import path from "path"
import { existsSync } from "node:fs"

function getChromeDataDir(): string {
    switch (os.platform()) {
        //I don't have a mac so... umm an attempt has been made
        case "darwin":
            let applications = path.resolve(process.env.HOME + "/Library/Application Support/"),
                google = applications + "/Google/Chrome"
            if(existsSync(applications + "/Chromium")) return applications + "/Chromium"
            if(existsSync(google)) return google
            if(existsSync(google + " Beta")) return google + " Beta"
            if(existsSync(google + " Canary")) return google + " Canary"
            break;

        case "linux":
            let config = path.resolve(process.env.HOME + "/.config")
            if(existsSync(config + "/chromium")) return config + "/chromium"
            if(existsSync(config + "/google-chrome")) return config + "/google-chrome"
            if(existsSync(config +"/google-chrome-beta")) return config +"/google-chrome-beta"
            if(existsSync(config + "/google-chrome-unstable")) return config + "/google-chrome-unstable"
            break;

        // need to test
        case "win32":
            let localAppData = path.resolve(process.env.LOCALAPPDATA || "")
            if (existsSync(localAppData + "\\Chromium")) return localAppData + "\\Chromium\\User Data"
            if (existsSync(localAppData + "\\Google\\Chrome")) return localAppData + "\\Google\\Chrome\\User Data"
            if (existsSync(localAppData + "\\Google\\Chrome Beta")) return localAppData + "\\Google\\Chrome Beta\\User Data"
            if (existsSync(localAppData + "\\Google\\Chrome SxS")) return localAppData + "\\Google\\Chrome SxS\\User Data"
            break;
    }
    return ""
}

export default {
    getChromeDataDir
}