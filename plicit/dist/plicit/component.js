"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unwrapComponentTree = exports.isComponent = void 0;
const proxy_1 = require("./proxy");
const signal_1 = require("./signal");
const isComponent = (x) => !!x && typeof x === 'function';
exports.isComponent = isComponent;
const unwrapComponentTree = (component, attribs) => {
    if ((0, signal_1.isSignal)(component))
        return component;
    if ((0, proxy_1.isRef)(component))
        return (0, exports.unwrapComponentTree)(component.value);
    if (!(0, exports.isComponent)(component))
        return component;
    const next = component(attribs);
    if ((0, exports.isComponent)(next))
        return (0, exports.unwrapComponentTree)(next, attribs);
    if ((0, signal_1.isSignal)(next)) {
        return next;
    }
    ;
    return next;
};
exports.unwrapComponentTree = unwrapComponentTree;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3BsaWNpdC9jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsbUNBQTBDO0FBQzFDLHFDQUF5RDtBQUtsRCxNQUFNLFdBQVcsR0FBRyxDQUFDLENBQU0sRUFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLEtBQUssVUFBVSxDQUFDO0FBQXpFLFFBQUEsV0FBVyxlQUE4RDtBQUUvRSxNQUFNLG1CQUFtQixHQUFHLENBQUMsU0FBMkUsRUFBRSxPQUF5QixFQUF3QyxFQUFFO0lBQ2xMLElBQUksSUFBQSxpQkFBUSxFQUFDLFNBQVMsQ0FBQztRQUFFLE9BQU8sU0FBUyxDQUFDO0lBQzFDLElBQUksSUFBQSxhQUFLLEVBQUMsU0FBUyxDQUFDO1FBQUUsT0FBTyxJQUFBLDJCQUFtQixFQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNsRSxJQUFJLENBQUMsSUFBQSxtQkFBVyxFQUFDLFNBQVMsQ0FBQztRQUFFLE9BQU8sU0FBUyxDQUFDO0lBQzlDLE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNoQyxJQUFJLElBQUEsbUJBQVcsRUFBQyxJQUFJLENBQUM7UUFBRSxPQUFPLElBQUEsMkJBQW1CLEVBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2pFLElBQUksSUFBQSxpQkFBUSxFQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDbkIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQUEsQ0FBQztJQUNGLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQyxDQUFBO0FBVlksUUFBQSxtQkFBbUIsdUJBVS9CIn0=