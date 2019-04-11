#!/usr/bin/env node

const homedir = require("os").homedir()
const path = require("path")
const fs = require("fs")
const configPath = path.join(homedir, ".nightenv.json")
const config = fs.existsSync(configPath)
  ? require(configPath)
  : null

const force = process.argv.indexOf("--force") !== -1

if (!config) {
  process.exit()
}

const prevHours = config.prevHours
const hours = new Date().getHours()
const { configurations, daytime, nighttime } = config

const prevWasNight = prevHours >= nighttime || prevHours < daytime
const isNight = hours >= nighttime || hours < daytime

const main = async () => {
  if (prevWasNight !== isNight || force) {
    for (let pluginName in configurations) {
      const plugin = require("requireg")(pluginName)
      configurations[pluginName] = await plugin.execute(configurations[pluginName], isNight)
    }
  }

  config.prevHours = hours

  fs.writeFileSync(configPath, JSON.stringify(config, false, "  "))
}


if (prevHours !== hours || force) {
  main()
}
