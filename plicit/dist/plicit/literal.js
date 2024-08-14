"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.literal = literal;
const proxy_1 = require("./proxy");
function literal(strings, ...args) {
    return String.raw({ raw: strings }, ...args.map(arg => {
        if ((0, proxy_1.isRef)(arg)) {
            return arg.value;
        }
        return arg;
    }));
}
//# sourceMappingURL=literal.js.map