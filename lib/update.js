#!/usr/bin/env node
"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const homedir = require("os").homedir();
const path = require("path");
const fs = require("fs");
const configPath = path.join(homedir, ".nightenv.json");
const config = fs.existsSync(configPath) ? require(configPath) : require("../nightenv.json");
const hours = new Date().getHours();
const { configurations, daytime, nighttime } = config;

const isNight = hours >= nighttime || hours < daytime;

const main = (() => {
  var _ref = _asyncToGenerator(function* () {
    for (let pluginName in configurations) {
      const plugin = require("requireg")(pluginName);
      configurations[pluginName] = yield plugin.execute(configurations[pluginName], isNight);
    }

    fs.writeFileSync(configPath, JSON.stringify(config, false, "  "));
  });

  return function main() {
    return _ref.apply(this, arguments);
  };
})();

main();