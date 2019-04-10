#!/usr/bin/env node

const homedir = require("os").homedir()
const path = require("path")
const fs = require("fs")
const configPath = path.join(homedir, ".nightenv.json")
const config = fs.existsSync(configPath)
  ? require(configPath)
  : require("../nightenv.json")
const hours = new Date().getHours()
const { configurations, daytime, nighttime } = config

const isNight = hours >= nighttime || hours < daytime

const main = async () => {
  for (let pluginName in configurations) {
    const plugin = require("requireg")(pluginName)
    configurations[pluginName] = await plugin.execute(configurations[pluginName], isNight)
  }

  fs.writeFileSync(configPath, JSON.stringify(config, false, "  "))
}

main()
