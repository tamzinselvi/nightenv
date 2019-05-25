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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
var fs = require("fs");
var util_1 = require("./util");
var CronJobStatus;
(function (CronJobStatus) {
    CronJobStatus[CronJobStatus["PreInstalled"] = 0] = "PreInstalled";
    CronJobStatus[CronJobStatus["Installed"] = 1] = "Installed";
})(CronJobStatus = exports.CronJobStatus || (exports.CronJobStatus = {}));
exports.crontabTemplate = function (nodeBin, updateBin) { return "\n# nightenv\n*/1 * * * * " + nodeBin + " " + updateBin + " update --lazy"; };
exports.configurationTemplate = function (daytime, nighttime) {
    if (daytime === void 0) { daytime = 9; }
    if (nighttime === void 0) { nighttime = 17; }
    return "{\n  \"configurations\": {},\n  \"daytime\": " + daytime + ",\n  \"nighttime\": " + nighttime + "\n}";
};
function installCronJob() {
    return __awaiter(this, void 0, void 0, function () {
        var status, crontab, crontabStr, nodeBin, updateBin;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, util_1.exec("crontab -l > crontmp")];
                case 1:
                    _a.sent();
                    if (!fs.existsSync("crontmp")) return [3, 7];
                    crontab = fs.readFileSync("crontmp");
                    crontabStr = crontab.toString();
                    if (!(crontabStr.indexOf("# nightenv") === -1)) return [3, 5];
                    return [4, util_1.exec("which node")];
                case 2:
                    nodeBin = _a.sent();
                    return [4, util_1.exec("which nightenv")];
                case 3:
                    updateBin = _a.sent();
                    crontabStr += exports.crontabTemplate(nodeBin.replace("\n", ""), updateBin.replace("\n", ""));
                    fs.writeFileSync("crontmp", crontabStr);
                    return [4, util_1.exec("crontab crontmp")];
                case 4:
                    _a.sent();
                    status = CronJobStatus.Installed;
                    return [3, 6];
                case 5:
                    status = CronJobStatus.PreInstalled;
                    _a.label = 6;
                case 6:
                    fs.unlinkSync("crontmp");
                    return [2, status];
                case 7: throw new Error("there was an issue updating your crontab");
            }
        });
    });
}
exports.installCronJob = installCronJob;
__export(require("./util"));
//# sourceMappingURL=index.js.map