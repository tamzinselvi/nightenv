#!/usr/bin/env node

require("colors")
const { exec: execCB } = require("child_process")
const rl = require("readline")
const homedir = require("os").homedir()
const path = require("path")
const fs = require("fs")

const ask = (question, rExp) => {
  const r = rl.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => r.question(`${question}\n`, (answer) => {
    r.close()

    if (rExp.test(answer)) {
      return resolve(answer)
    }

    return resolve(ask(question, rExp))
  }))
}

const exec = (cmd) => {
  return new Promise((resolve, reject) => {
    execCB(cmd, (error, stdout) => {
      if (error) {
        return reject(error)
      }

      resolve(stdout)
    })
  })
}

const configurationTemplate = (daytime, nighttime) => `{
  "configurations": {},
  "daytime": ${daytime},
  "nighttime": ${nighttime}
}`

const crontabTemplate = (nodeBin, updateBin) => `
# nightenv
*/1 * * * * ${nodeBin} ${updateBin}`


const main = async () => {
  console.log("🌙 nightenv\n".blue)

  const configPath = path.join(homedir, ".nightenv.json")
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
  }

  await exec("crontab -l > crontmp")

  if (fs.existsSync("crontmp")) {
    const crontab = fs.readFileSync("crontmp")
    let crontabStr = crontab.toString()

    if (crontabStr.indexOf("# nightenv") === -1) {
      const nodeBin = await exec("which node")
      const updateBin = await exec("which nightenv-update")

      crontabStr += crontabTemplate(nodeBin.replace("\n", ""), updateBin.replace("\n", ""))

      fs.writeFileSync("crontmp", crontabStr)


      await exec("crontab crontmp")

      console.log("successfully updated your crontab".green)
    } else {
      console.log("crontab entry already found, no changes made".green)
    }

    fs.unlinkSync("crontmp")
  } else {
    console.log("there was an issue updating your crontab".red)
    process.exit(1)
  }
}

main()
