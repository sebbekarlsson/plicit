"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onUnmounted = exports.onBeforeUnmount = exports.onMounted = exports.trackCurrentScope = exports.withCurrentScope = exports.popScope = exports.pushScope = exports.GScope = exports.createComponentScope = void 0;
const createComponentScope = () => {
    return ({
        onMounted: [],
        onUnmounted: [],
        onBeforeUnmount: [],
        onLoaded: [],
        children: [],
        stack: [],
        stackIndex: 0,
        current: null,
    });
};
exports.createComponentScope = createComponentScope;
// @ts-ignore
const oldScope = window.GScope;
exports.GScope = oldScope || (0, exports.createComponentScope)();
// @ts-ignore
window.GScope = exports.GScope;
const pushScope = () => {
    if (exports.GScope.current) {
        exports.GScope.stack.push(exports.GScope.current);
    }
    const scope = (0, exports.createComponentScope)();
    exports.GScope.current = scope;
    return scope;
};
exports.pushScope = pushScope;
const popScope = (scope) => {
    exports.GScope.current = exports.GScope.stack.pop() || null;
    return scope;
};
exports.popScope = popScope;
const withCurrentScope = (fun) => {
    const scope = exports.GScope.current || exports.GScope.stack[exports.GScope.stack.length - 1];
    if (!scope)
        return;
    fun(scope);
};
exports.withCurrentScope = withCurrentScope;
const trackCurrentScope = () => {
};
exports.trackCurrentScope = trackCurrentScope;
const onMounted = (fun) => {
    (0, exports.withCurrentScope)((scope) => {
        if (!scope.onMounted.includes(fun)) {
            scope.onMounted.push(fun);
        }
    });
};
exports.onMounted = onMounted;
const onBeforeUnmount = (fun) => {
    (0, exports.withCurrentScope)((scope) => {
        if (!scope.onBeforeUnmount.includes(fun)) {
            scope.onBeforeUnmount.push(fun);
        }
    });
};
exports.onBeforeUnmount = onBeforeUnmount;
const onUnmounted = (fun) => {
    (0, exports.withCurrentScope)((scope) => {
        if (!scope.onUnmounted.includes(fun)) {
            scope.onUnmounted.push(fun);
        }
    });
};
exports.onUnmounted = onUnmounted;
//# sourceMappingURL=scope.js.map