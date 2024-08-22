"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canBeAutoDiffed = void 0;
const canBeAutoDiffed = (a, b) => {
    return typeof a !== "object" && typeof b !== "object";
};
exports.canBeAutoDiffed = canBeAutoDiffed;
//# sourceMappingURL=utils.js.map