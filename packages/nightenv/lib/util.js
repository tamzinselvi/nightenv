"use strict";
exports.__esModule = true;
var child_process_1 = require("child_process");
var rl = require("readline");
exports.ask = function (question, rExp) {
    var r = rl.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(function (resolve) { return r.question(question + "\n", function (answer) {
        r.close();
        if (rExp.test(answer)) {
            return resolve(answer);
        }
        return resolve(exports.ask(question, rExp));
    }); });
};
exports.exec = function (cmd) {
    return new Promise(function (resolve, reject) {
        child_process_1.exec(cmd, function (error, stdout) {
            if (error) {
                return reject(error);
            }
            resolve(stdout.toString());
        });
    });
};
exports.timeout = function (time) {
    return new Promise(function (resolve) {
        return setTimeout(resolve, time);
    });
};
//# sourceMappingURL=util.js.map