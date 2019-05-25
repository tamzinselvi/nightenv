#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
require("colors");
var fs = require("fs");
var path = require("path");
var os = require("os");
var program = require("commander");
var lib_1 = require("../lib");
var packageJSON = require("../package.json");
console.log("🌙 nightenv\n".blue);
program
    .version("v" + packageJSON.version);
program
    .command("init")
    .action(function () { return __awaiter(_this, void 0, void 0, function () {
    var configPath, shouldCreateConfiguration, daytime, nighttime, cronStatus;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                configPath = path.join(os.homedir(), ".nightenv.json");
                if (!!fs.existsSync(configPath)) return [3, 4];
                return [4, lib_1.ask("no existing configuration found, create one now?".blue + " (" + "yN".yellow + ")", /^[ynYN]$/)];
            case 1:
                shouldCreateConfiguration = _a.sent();
                if (/[nN]/.test(shouldCreateConfiguration)) {
                    console.log("nightenv failed due to missing configuration".red);
                    process.exit(1);
                }
                return [4, lib_1.ask("what hour of the day does your day start?".blue + " (" + "0-23".yellow + ")", /^([0-9]|1[0-9]|2[0-3])$/)];
            case 2:
                daytime = _a.sent();
                return [4, lib_1.ask("what hour of the day does your night start?".blue + " (" + "0-23".yellow + ")", /^([0-9]|1[0-9]|2[0-3])$/)];
            case 3:
                nighttime = _a.sent();
                fs.writeFileSync(configPath, lib_1.configurationTemplate(daytime, nighttime));
                return [3, 5];
            case 4:
                console.log("configuration already exists".green);
                _a.label = 5;
            case 5: return [4, lib_1.installCronJob()];
            case 6:
                cronStatus = _a.sent();
                switch (cronStatus) {
                    case lib_1.CronJobStatus.Installed:
                        console.log("crontab updated".green);
                        break;
                    case lib_1.CronJobStatus.PreInstalled:
                    default:
                        console.log("no changes made to crontab".green);
                        break;
                }
                return [2];
        }
    });
}); });
program
    .command("update")
    .option("-l, --lazy", "only updates once per hour")
    .option("-f, --force", "force an update")
    .option("-v, --verbose", "print errors and debug messages")
    .action(function (_a) {
    var lazy = _a.lazy, force = _a.force, verbose = _a.verbose;
    return __awaiter(_this, void 0, void 0, function () {
        var configPath, config, prevHours, hours, configurations, daytime, nighttime, prevWasNight, isNight, _b, _c, _i, pluginName, plugin, _d, _e, e_1;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    configPath = path.join(os.homedir(), ".nightenv.json");
                    config = fs.existsSync(configPath)
                        ? JSON.parse(fs.readFileSync(configPath).toString())
                        : null;
                    if (!config) {
                        console.log("failed to load your configuration, have you run `nightenv init`?".red);
                        process.exit(1);
                    }
                    prevHours = config.prevHours;
                    hours = new Date().getHours();
                    configurations = config.configurations, daytime = config.daytime, nighttime = config.nighttime;
                    prevWasNight = prevHours >= nighttime || prevHours < daytime;
                    isNight = hours >= nighttime || hours < daytime;
                    if (prevHours === hours && lazy && !force) {
                        return [2];
                    }
                    if (!(prevWasNight !== isNight || force)) return [3, 6];
                    _b = [];
                    for (_c in configurations)
                        _b.push(_c);
                    _i = 0;
                    _f.label = 1;
                case 1:
                    if (!(_i < _b.length)) return [3, 6];
                    pluginName = _b[_i];
                    plugin = require("requireg")(pluginName);
                    _f.label = 2;
                case 2:
                    _f.trys.push([2, 4, , 5]);
                    _d = configurations;
                    _e = pluginName;
                    return [4, plugin.execute(configurations[pluginName], { isNight: isNight })];
                case 3:
                    _d[_e] = _f.sent();
                    return [3, 5];
                case 4:
                    e_1 = _f.sent();
                    console.log(("failed to execute plugin (" + pluginName.yellow + ")").red);
                    if (verbose) {
                        console.error(e_1);
                    }
                    return [3, 5];
                case 5:
                    _i++;
                    return [3, 1];
                case 6:
                    config.prevHours = hours;
                    fs.writeFileSync(configPath, JSON.stringify(config, undefined, "  "));
                    return [2];
            }
        });
    });
});
program.parse(process.argv);
//# sourceMappingURL=nightenv.js.map