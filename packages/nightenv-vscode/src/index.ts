import { NightenvExecuteFn } from "nightenv"
import * as os from "os"
import * as path from "path"
import * as fs from "fs"

const homedir = os.homedir()

interface NightenvVscodeConfiguration {
  day: string;
  night: string;
}

export const execute: NightenvExecuteFn<NightenvVscodeConfiguration> = (
  configuration: NightenvVscodeConfiguration,
  options,
) => {
  const vscodeSettingsPath = path.join(homedir, "Library", "Application Support", "Code", "User", "settings.json")

  const vscodeSettings = require(vscodeSettingsPath)
  vscodeSettings["workbench.colorTheme"] = options.isNight ? configuration.night : configuration.day

  fs.writeFileSync(
    vscodeSettingsPath,
    JSON.stringify(vscodeSettings, undefined, "  "),
  )

  return Promise.resolve(configuration)
}
