import { NightenvExecuteFn, exec, timeout } from "nightenv"
import * as os from "os"
import * as path from "path"
import * as sqlite from "sqlite"

const darkMode = require("dark-mode")
const homedir = os.homedir()

const dbPromise = sqlite.open(
  path.join(homedir, "Library", "Application Support", "Dock", "desktoppicture.db"),
  { promise: Promise },
)

interface Display {
  day: string;
  night: string;
}

interface NightenvOsxConfiguration {
  displays: Display[];
}

export const execute: NightenvExecuteFn<NightenvOsxConfiguration> = async (
  configuration: NightenvOsxConfiguration,
  options
) => {
  if (options.isNight) {
    await darkMode.enable()
  } else {
    await darkMode.disable()
  }

  if (configuration.displays) {
    const db = await dbPromise

    for (let i = 0; i < configuration.displays.length; i++) {
      const display = configuration.displays[i]
      let imagePath = options.isNight ? display.night : display.day
      const possibleImagePaths = [imagePath]
      let optionalQueryAmendment = ""
      if (imagePath.indexOf(homedir) !== -1) {
        const alternativeImagePath = path.join("~", imagePath.replace(homedir, ""))
        possibleImagePaths.push(alternativeImagePath)
        imagePath = alternativeImagePath
        optionalQueryAmendment = " OR value = ?"
      }
      let hasPicture =
        await db.get(`SELECT rowid FROM data WHERE value = ?${optionalQueryAmendment}`, possibleImagePaths)
      if (!hasPicture) {
        await db.run("INSERT INTO data (value) VALUES (?)", imagePath)
        hasPicture = await db.get("SELECT rowid FROM data WHERE value = ?", imagePath)
      }
      const pictures = await db.all("SELECT rowid FROM pictures WHERE display_id = ?", i + 1)
      const pictureIds = pictures.map(picture => picture.rowid).join(", ")
      await db.run(
        `UPDATE preferences SET data_id = ? WHERE picture_id IN (${pictureIds})`,
        hasPicture.rowid,
      )
    }
    await exec("killall Dock")
    let pgrepOut = await exec("pgrep -f Dock")
    while (!pgrepOut.length) {
      await timeout(1000)
      pgrepOut = await exec("pgrep -f Dock")
    }
    await timeout(5000)
  }

  return configuration
}
