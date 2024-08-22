"use strict";
//export type CSSProperties = {};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeClasses = exports.cssPropsToString = void 0;
const tsmathutil_1 = require("tsmathutil");
const reactivity_1 = require("./reactivity");
const kebab = (str) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
const cssPropsToString = (props) => {
    return Object.entries(props).map(([key, value]) => {
        return `${kebab(key)}: ${value}`;
    }).join(';');
};
exports.cssPropsToString = cssPropsToString;
const mergeClasses = (clazz) => {
    if (typeof clazz === 'string')
        return clazz;
    return (0, tsmathutil_1.unique)(clazz).map(it => (0, reactivity_1.isSignal)(it) ? it.get() : it).join(' ');
};
exports.mergeClasses = mergeClasses;
//# sourceMappingURL=css.js.map