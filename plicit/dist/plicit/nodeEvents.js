"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENodeEvent = void 0;
var ENodeEvent;
(function (ENodeEvent) {
    ENodeEvent["MOUNTED"] = "MOUNTED";
    ENodeEvent["UNMOUNTED"] = "UNMOUNTED";
    ENodeEvent["BEFORE_UNMOUNT"] = "BEFORE_UNMOUNT";
    ENodeEvent["BEFORE_REPLACE"] = "BEFORE_REPLACE";
    ENodeEvent["BEFORE_RENDER"] = "BEFORE_RENDER";
    ENodeEvent["AFTER_REPLACE"] = "AFTER_REPLACE";
    ENodeEvent["RECEIVE_PARENT"] = "RECEIVE_PARENT";
    ENodeEvent["CLEANUP"] = "CLEANUP";
    ENodeEvent["REPLACED"] = "REPLACED";
    ENodeEvent["UPDATED"] = "UPDATED";
    ENodeEvent["LOADED"] = "LOADED";
})(ENodeEvent || (exports.ENodeEvent = ENodeEvent = {}));
//# sourceMappingURL=nodeEvents.js.map