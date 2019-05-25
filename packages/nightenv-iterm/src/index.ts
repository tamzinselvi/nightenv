import * as os from "os"
import * as path from "path"
import * as fs from "fs"
import { NightenvExecuteFn } from "nightenv"

interface NightenvIterm2Configuration {
  day: string;
  night: string;
}

const template = (profile: string) => `{
  "Profiles": [
    {
      "Name": "Nightenv",
      "Guid": "ba19744f-6af3-434d-aaa6-0a48e0969958",
      "Dynamic Profile Parent Name": "${profile}"
    }
  ]
}`

export const execute: NightenvExecuteFn = async (configuration: NightenvIterm2Configuration, options) => {
  fs.writeFileSync(
    path.join(os.homedir(), "Library", "Application Support", "iTerm2", "DynamicProfiles", "Nightenv.plist"),
    template(options.isNight ? configuration.night : configuration.day),
  )

  return Promise.resolve(configuration)
}
