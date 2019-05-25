import { NightenvExecuteFn, exec } from "nightenv"
import * as fs from "fs"

interface NightenvSlackConfiguration {
  darkJs: string
}

const ssbInteropTemplate = (js: string) => `
// nightenv begin
${js}
// nightenv end`

export const execute: NightenvExecuteFn<NightenvSlackConfiguration> = async (
  config: NightenvSlackConfiguration,
  options,
) => {
  const ssbInteropPath = "/Applications/Slack.app/Contents/Resources/app.asar.unpacked/src/static/ssb-interop.js"

  const js = fs.readFileSync(config.darkJs)

  const template = ssbInteropTemplate(js.toString())

  let ssbInteropContents = fs.readFileSync(ssbInteropPath).toString()

  if (options.isNight) {
    ssbInteropContents += template
  } else {
    ssbInteropContents = ssbInteropContents.replace(template, "")
  }

  fs.writeFileSync(ssbInteropPath, ssbInteropContents)

  await exec(`osascript -e 'tell application "System Events"
  tell application "Slack" to activate
  delay .25
  key code 15 using {command down}
  delay .25
  set visible of process "Slack" to false
end tell'`)

  return config
}
