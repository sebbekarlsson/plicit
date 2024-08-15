"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computedAsync = exports.computed = void 0;
const _1 = require(".");
const computed = (fun, deps = [], options = {}) => {
    const r = (0, _1.ref)(fun(), options);
    r._deps = deps;
    deps.forEach((dep) => {
        (0, _1.deepSubscribe)(dep, {
            onSet: () => {
                r.value = fun();
            },
            onTrigger: () => {
                r.value = fun();
            }
        });
    });
    return r;
};
exports.computed = computed;
const computedAsync = (fun, deps = [], options = {}) => {
    const r = (0, _1.ref)(null, options);
    const status = (0, _1.ref)("idle");
    r._deps = deps;
    const refresh = async () => {
        status.value = "pending";
        try {
            r.value = await fun();
            status.value = "resolved";
        }
        catch (e) {
            console.error(e);
            status.value = "error";
        }
    };
    deps.forEach((dep) => {
        (0, _1.deepSubscribe)(dep, {
            onSet: () => {
                refresh().catch((e) => console.error(e));
            },
            onTrigger: () => {
                refresh().catch((e) => console.error(e));
            }
        });
    });
    queueMicrotask(async () => {
        await refresh();
    });
    return { data: r, status: status, refresh };
};
exports.computedAsync = computedAsync;
//# sourceMappingURL=computed.js.map