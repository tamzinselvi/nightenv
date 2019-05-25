#!/usr/bin/env node

import "colors"
import * as fs from "fs"
import * as path from "path"
import * as os from "os"
import * as program from "commander"

import {
  CronJobStatus,
  NightenvModule,
  ask,
  configurationTemplate,
  installCronJob,
} from "../lib"

const packageJSON = require("../package.json")

console.log("🌙 nightenv\n".blue)

program
  .version(`v${packageJSON.version}`)

program
  .command("init")
  .action(async () => {
    const configPath = path.join(os.homedir(), ".nightenv.json")
    if (!fs.existsSync(configPath)) {
      const shouldCreateConfiguration =
        await ask(`${"no existing configuration found, create one now?".blue} (${"yN".yellow})`, /^[ynYN]$/)

      if (/[nN]/.test(shouldCreateConfiguration)) {
        console.log("nightenv failed due to missing configuration".red)
        process.exit(1)
      }

      const daytime =
        await ask(`${"what hour of the day does your day start?".blue} (${"0-23".yellow})`, /^([0-9]|1[0-9]|2[0-3])$/)

      const nighttime =
        await ask(`${"what hour of the day does your night start?".blue} (${"0-23".yellow})`, /^([0-9]|1[0-9]|2[0-3])$/)

      fs.writeFileSync(configPath, configurationTemplate(daytime, nighttime))
    } else {
      console.log("configuration already exists".green)
    }

    const cronStatus = await installCronJob()

    switch (cronStatus) {
      case CronJobStatus.Installed:
        console.log("crontab updated".green)
        break
      case CronJobStatus.PreInstalled:
      default:
        console.log("no changes made to crontab".green)
        break
    }
  })

program
  .command("update")
  .option("-l, --lazy", "only updates once per hour")
  .option("-f, --force", "force an update")
  .option("-v, --verbose", "print errors and debug messages")
  .action(async ({ lazy, force, verbose }: { lazy: boolean, force: boolean, verbose: boolean }) => {
    const configPath = path.join(os.homedir(), ".nightenv.json")

    const config = fs.existsSync(configPath)
      ? JSON.parse(fs.readFileSync(configPath).toString())
      : null

    if (!config) {
      console.log("failed to load your configuration, have you run `nightenv init`?".red)
      process.exit(1)
    }

    const prevHours = config.prevHours

    const hours = new Date().getHours()
    const { configurations, daytime, nighttime } = config

    const prevWasNight = prevHours >= nighttime || prevHours < daytime
    const isNight = hours >= nighttime || hours < daytime

    if (prevHours === hours && lazy && !force) {
      return
    }

    if (prevWasNight !== isNight || force) {
      for (let pluginName in configurations) {
        const plugin = require("requireg")(pluginName) as NightenvModule
        try {
          configurations[pluginName] = await plugin.execute(configurations[pluginName], { isNight })
        } catch (e) {
          console.log(`failed to execute plugin (${pluginName.yellow})`.red)
          if (verbose) {
            console.error(e)
          }
        }
      }
    }

    config.prevHours = hours

    fs.writeFileSync(configPath, JSON.stringify(config, undefined, "  "))
  })

program.parse(process.argv)