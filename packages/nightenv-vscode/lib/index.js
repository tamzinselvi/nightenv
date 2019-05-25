"use strict";
exports.__esModule = true;
var os = require("os");
var path = require("path");
var fs = require("fs");
var homedir = os.homedir();
exports.execute = function (configuration, options) {
    var vscodeSettingsPath = path.join(homedir, "Library", "Application Support", "Code", "User", "settings.json");
    var vscodeSettings = require(vscodeSettingsPath);
    vscodeSettings["workbench.colorTheme"] = options.isNight ? configuration.night : configuration.day;
    fs.writeFileSync(vscodeSettingsPath, JSON.stringify(vscodeSettings, undefined, "  "));
    return Promise.resolve(configuration);
};
//# sourceMappingURL=index.js.map