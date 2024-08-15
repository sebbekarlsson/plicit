"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEmitter = void 0;
class EventEmitter {
    slots = {};
    emit(event) {
        if (!this.slots[event.type] || this.slots[event.type].length <= 0)
            return;
        this.slots[event.type].forEach((sub) => {
            try {
                sub(event);
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    addEventListener(evtype, sub) {
        this.slots[evtype] ??= [];
        if (!this.slots[evtype].includes(sub)) {
            this.slots[evtype].push(sub);
        }
        return () => {
            this.slots[evtype] = this.slots[evtype].filter((it) => it !== sub);
        };
    }
    clear() {
        this.slots = {};
    }
}
exports.EventEmitter = EventEmitter;
//# sourceMappingURL=event.js.map