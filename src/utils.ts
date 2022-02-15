import os from "node:os"
import path from "path"
import { existsSync } from "node:fs"

function getChromeDataDir(): string {
    switch (os.platform()) {
        // need to test
        // case "win32":
        //     if (existsSync(path.resolve("%LOCALAPPDATA%\Google\Chrome\User Data"))) return "%LOCALAPPDATA%\Google\Chrome\User Data"
        //     if (existsSync(path.resolve("%LOCALAPPDATA%\Google\Chrome Beta\User Data"))) return "%LOCALAPPDATA%\Google\Chrome Beta\User Data"
        //     if (existsSync(path.resolve("%LOCALAPPDATA%\Google\Chrome SxS\User Data"))) return "%LOCALAPPDATA%\Google\Chrome SxS\User Data"
        //     if (existsSync(path.resolve("%LOCALAPPDATA%\Chromium\User Data"))) return "%LOCALAPPDATA%\Chromium\User Data"
        //     break;

        // case "darwin":
        //  I don't own a mac <.< maybe someone who does might wanna reach out?

        case "linux":
            let config = path.resolve(process.env.HOME + "/.config")
            if(existsSync(config + "/chromium")) return config + "/chromium"
            if(existsSync(config + "/google-chrome")) return config + "/google-chrome"
            if(existsSync(config +"/google-chrome-beta")) return config +"/google-chrome-beta"
            if(existsSync(config + "/google-chrome-unstable")) return config + "/google-chrome-unstable"
            break;
    }
    return ""
}

export default {
    getChromeDataDir
}