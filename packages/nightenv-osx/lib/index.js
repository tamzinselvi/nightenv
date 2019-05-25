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
var nightenv_1 = require("nightenv");
var os = require("os");
var path = require("path");
var sqlite = require("sqlite");
var darkMode = require("dark-mode");
var homedir = os.homedir();
var dbPromise = sqlite.open(path.join(homedir, "Library", "Application Support", "Dock", "desktoppicture.db"), { promise: Promise });
exports.execute = function (configuration, options) { return __awaiter(_this, void 0, void 0, function () {
    var db, i, display, imagePath, possibleImagePaths, optionalQueryAmendment, alternativeImagePath, hasPicture, pictures, pictureIds, pgrepOut;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!options.isNight) return [3, 2];
                return [4, darkMode.enable()];
            case 1:
                _a.sent();
                return [3, 4];
            case 2: return [4, darkMode.disable()];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                if (!configuration.displays) return [3, 22];
                return [4, dbPromise];
            case 5:
                db = _a.sent();
                i = 0;
                _a.label = 6;
            case 6:
                if (!(i < configuration.displays.length)) return [3, 14];
                display = configuration.displays[i];
                imagePath = options.isNight ? display.night : display.day;
                possibleImagePaths = [imagePath];
                optionalQueryAmendment = "";
                if (imagePath.indexOf(homedir) !== -1) {
                    alternativeImagePath = path.join("~", imagePath.replace(homedir, ""));
                    possibleImagePaths.push(alternativeImagePath);
                    imagePath = alternativeImagePath;
                    optionalQueryAmendment = " OR value = ?";
                }
                return [4, db.get("SELECT rowid FROM data WHERE value = ?" + optionalQueryAmendment, possibleImagePaths)];
            case 7:
                hasPicture = _a.sent();
                if (!!hasPicture) return [3, 10];
                return [4, db.run("INSERT INTO data (value) VALUES (?)", imagePath)];
            case 8:
                _a.sent();
                return [4, db.get("SELECT rowid FROM data WHERE value = ?", imagePath)];
            case 9:
                hasPicture = _a.sent();
                _a.label = 10;
            case 10: return [4, db.all("SELECT rowid FROM pictures WHERE display_id = ?", i + 1)];
            case 11:
                pictures = _a.sent();
                pictureIds = pictures.map(function (picture) { return picture.rowid; }).join(", ");
                return [4, db.run("UPDATE preferences SET data_id = ? WHERE picture_id IN (" + pictureIds + ")", hasPicture.rowid)];
            case 12:
                _a.sent();
                _a.label = 13;
            case 13:
                i++;
                return [3, 6];
            case 14: return [4, nightenv_1.exec("killall Dock")];
            case 15:
                _a.sent();
                return [4, nightenv_1.exec("pgrep -f Dock")];
            case 16:
                pgrepOut = _a.sent();
                _a.label = 17;
            case 17:
                if (!!pgrepOut.length) return [3, 20];
                return [4, nightenv_1.timeout(1000)];
            case 18:
                _a.sent();
                return [4, nightenv_1.exec("pgrep -f Dock")];
            case 19:
                pgrepOut = _a.sent();
                return [3, 17];
            case 20: return [4, nightenv_1.timeout(5000)];
            case 21:
                _a.sent();
                _a.label = 22;
            case 22: return [2, configuration];
        }
    });
}); };
//# sourceMappingURL=index.js.map