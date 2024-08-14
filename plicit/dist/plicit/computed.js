"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computedAsync = exports.computed = void 0;
const proxy_1 = require("./proxy");
const subscribe_1 = require("./subscribe");
const types_1 = require("./types");
const computed = (fun, deps = []) => {
    const r = (0, proxy_1.ref)(fun());
    r._deps = deps;
    deps.forEach((dep) => {
        (0, subscribe_1.deepSubscribe)(dep, {
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
    const r = (0, proxy_1.ref)(null);
    const status = (0, proxy_1.ref)("idle");
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
        const d = (0, types_1.unwrapReactiveDep)(dep);
        if ((0, proxy_1.isRef)(d)) {
            d.subscribe({
                onSet: () => {
                    refresh().catch((e) => console.error(e));
                },
                onTrigger: () => {
                    refresh().catch((e) => console.error(e));
                }
            });
        }
    });
    queueMicrotask(async () => {
        await refresh();
    });
    return { data: r, status: status, refresh };
};
exports.computedAsync = computedAsync;
//# sourceMappingURL=computed.js.map