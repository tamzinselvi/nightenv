import * as fs from "fs"

import { exec } from "./util"

export interface NightenvOptions {
  isNight: boolean;
}

export type NightenvExecuteFn<NightenvConfiguration = Object> =
  (configuration: NightenvConfiguration, options: NightenvOptions) => Promise<NightenvConfiguration>

export interface NightenvModule<NightenvConfiguration = Object> {
  execute: NightenvExecuteFn<NightenvConfiguration>
}

export enum CronJobStatus {
  PreInstalled,
  Installed,
}

export const crontabTemplate = (nodeBin: string, updateBin: string) => `
# nightenv
*/1 * * * * ${nodeBin} ${updateBin} update --lazy`

export const configurationTemplate = (daytime = 9, nighttime = 17) => `{
  "configurations": {},
  "daytime": ${daytime},
  "nighttime": ${nighttime}
}`

export async function installCronJob() {
  let status: CronJobStatus

  await exec("crontab -l > crontmp")

  if (fs.existsSync("crontmp")) {
    const crontab = fs.readFileSync("crontmp")
    let crontabStr = crontab.toString()

    if (crontabStr.indexOf("# nightenv") === -1) {
      const nodeBin = await exec("which node")
      const updateBin = await exec("which nightenv")

      crontabStr += crontabTemplate(nodeBin.replace("\n", ""), updateBin.replace("\n", ""))

      fs.writeFileSync("crontmp", crontabStr)

      await exec("crontab crontmp")

      status = CronJobStatus.Installed
    } else {
      status = CronJobStatus.PreInstalled
    }

    fs.unlinkSync("crontmp")

    return status
  } else {
    throw new Error("there was an issue updating your crontab")
  }
}

export * from "./util"