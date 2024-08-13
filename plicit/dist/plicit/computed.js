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
                onGet: () => { },
            });
        }
    });
    queueMicrotask(async () => {
        await refresh();
    });
    return { data: r, status: status, refresh };
};
exports.computedAsync = computedAsync;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcHV0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGxpY2l0L2NvbXB1dGVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUEwQztBQUMxQywyQ0FBNEM7QUFDNUMsbUNBQXlEO0FBS2xELE1BQU0sUUFBUSxHQUFHLENBQ3RCLEdBQW1CLEVBQ25CLE9BQXNCLEVBQUUsRUFDaEIsRUFBRTtJQUNWLE1BQU0sQ0FBQyxHQUFHLElBQUEsV0FBRyxFQUFJLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDeEIsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7SUFFZixJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7UUFDbkIsSUFBQSx5QkFBYSxFQUFDLEdBQUcsRUFBRTtZQUNqQixLQUFLLEVBQUUsR0FBRyxFQUFFO2dCQUNWLENBQUMsQ0FBQyxLQUFLLEdBQUcsR0FBRyxFQUFFLENBQUM7WUFDbEIsQ0FBQztTQUNGLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxDQUFDLENBQUM7QUFDWCxDQUFDLENBQUM7QUFoQlcsUUFBQSxRQUFRLFlBZ0JuQjtBQUlLLE1BQU0sYUFBYSxHQUFHLENBQzNCLEdBQXdCLEVBQ3hCLE9BQXNCLEVBQUUsRUFLeEIsRUFBRTtJQUNGLE1BQU0sQ0FBQyxHQUFHLElBQUEsV0FBRyxFQUFXLElBQUksQ0FBQyxDQUFDO0lBQzlCLE1BQU0sTUFBTSxHQUFHLElBQUEsV0FBRyxFQUFzQixNQUFNLENBQUMsQ0FBQztJQUNoRCxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztJQUVmLE1BQU0sT0FBTyxHQUFHLEtBQUssSUFBSSxFQUFFO1FBQ3pCLE1BQU0sQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDO1FBQ3pCLElBQUksQ0FBQztZQUNILENBQUMsQ0FBQyxLQUFLLEdBQUcsTUFBTSxHQUFHLEVBQUUsQ0FBQztZQUN0QixNQUFNLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQztRQUM1QixDQUFDO1FBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUNYLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakIsTUFBTSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7UUFDekIsQ0FBQztJQUNILENBQUMsQ0FBQztJQUVGLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUNuQixNQUFNLENBQUMsR0FBRyxJQUFBLHlCQUFpQixFQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pDLElBQUksSUFBQSxhQUFLLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUNiLENBQUMsQ0FBQyxTQUFTLENBQUM7Z0JBQ1YsS0FBSyxFQUFFLEdBQUcsRUFBRTtvQkFDVixPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDM0MsQ0FBQztnQkFDRCxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUUsQ0FBQzthQUNoQixDQUFDLENBQUM7UUFDTCxDQUFDO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxjQUFjLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDeEIsTUFBTSxPQUFPLEVBQUUsQ0FBQztJQUNsQixDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLENBQUM7QUFDOUMsQ0FBQyxDQUFDO0FBeENXLFFBQUEsYUFBYSxpQkF3Q3hCIn0=