"use strict";
//export type CSSProperties = {};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cssPropsToString = void 0;
const kebab = (str) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
const cssPropsToString = (props) => {
    return Object.entries(props).map(([key, value]) => {
        return `${kebab(key)}: ${value}`;
    }).join(';');
};
exports.cssPropsToString = cssPropsToString;
//# sourceMappingURL=css.js.map