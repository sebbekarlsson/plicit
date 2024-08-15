"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computedAsync = exports.computed = void 0;
const reactivity_1 = require("./reactivity");
const computed = (fun, deps = []) => {
    const r = (0, reactivity_1.ref)(fun());
    r._deps = deps;
    deps.forEach((dep) => {
        (0, reactivity_1.deepSubscribe)(dep, {
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
const computedAsync = (fun, deps = []) => {
    const r = (0, reactivity_1.ref)(null);
    const status = (0, reactivity_1.ref)("idle");
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
        (0, reactivity_1.deepSubscribe)(dep, {
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