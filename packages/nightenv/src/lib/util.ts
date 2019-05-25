import { exec as execCB } from "child_process"
import * as rl from "readline"

export const ask = (question: string, rExp: RegExp): Promise<any> => {
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

export const exec = (cmd: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    execCB(cmd, (error, stdout) => {
      if (error) {
        return reject(error)
      }

      resolve(stdout.toString())
    })
  })
}