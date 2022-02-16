import os from "node:os"
import path from "path"
import { existsSync } from "node:fs"

function getChromeDataDir(): string {
    switch (os.platform()) {
        //I don't have a mac so... umm an attempt has been made
        // case "darwin":
        //     let applications = path.resolve(process.env.HOME + "/Library/Application Support/"),
        //         google = applications + "/Google/Chrome"
        //     if(existsSync(applications + "/Chromium")) return applications + "/Chromium"
        //     if(existsSync(google)) return google
        //     if(existsSync(google + " Beta")) return google + " Beta"
        //     if(existsSync(google + " Canary")) return google + " Canary"
        //     break;
        // Can't find executable location through google so 🤷‍♀️

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

function getChromeExecutable(): string {
    switch (os.platform()) {
        // no idea how to do this
        // case "darwin":
        //     let applications = path.resolve(process.env.HOME + "/Library/Application Support/"),
        //         google = applications + "/Google/Chrome"
        //     if(existsSync(applications + "/Chromium")) return applications + "/Chromium"
        //     if(existsSync(google)) return google
        //     if(existsSync(google + " Beta")) return google + " Beta"
        //     if(existsSync(google + " Canary")) return google + " Canary"
        //     break;

        case "linux":
            let bin = "/usr/bin/"
            if(existsSync(bin + "chromium")) return bin + "chromium"
            if(existsSync(bin + "google-chrome-stable")) return bin + "google-chrome-stable"
            if(existsSync(bin +"google-chrome-beta")) return bin + "google-chrome-beta"
            if(existsSync(bin + "google-chrome-unstable")) return bin + "google-chrome-unstable"
            break;

        // need to test this too
        case "win32":
            let programFiles = os.arch() == "x64" ? "C:\\Program Files (x86)\\" : "C:\\Program Files"
            if (existsSync(programFiles + "Chromium")) return programFiles + "Chromium\\Application\\chromium.exe"
            if (existsSync(programFiles + "Google\\Chrome")) return programFiles + "Google\\Chrome\\Application\\chrome.exe"
            if (existsSync(programFiles + "Google\\Chrome Beta")) return programFiles + "Google\\Chrome Beta\\Application\\chrome.exe"
            if (existsSync(programFiles + "Google\\Chrome SxS")) return programFiles + "Google\\Chrome SxS\\Application\\chrome.exe"
            break;
    }
    return ""
}

export default {
    getChromeDataDir,
    getChromeExecutable
}