"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepSubscribe = void 0;
const proxy_1 = require("./proxy");
const types_1 = require("./types");
const deepSubscribe = (dep, sub, maxDepth = -1) => {
    const unsubs = [];
    const subscribe = (dep, sub, depth = 0) => {
        const d = (0, types_1.unwrapReactiveDep)(dep);
        if ((0, proxy_1.isRef)(d)) {
            unsubs.push(d.subscribe({
                onSet: (...args) => {
                    if (sub.onSet) {
                        sub.onSet(...args);
                    }
                },
                onGet: (...args) => {
                    if (sub.onGet) {
                        sub.onGet(...args);
                    }
                },
            }));
            if (depth < maxDepth) {
                d._deps.forEach((child) => subscribe(child, sub, depth + 1));
            }
        }
    };
    subscribe(dep, sub, 0);
    return unsubs;
};
exports.deepSubscribe = deepSubscribe;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Vic2NyaWJlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3BsaWNpdC9zdWJzY3JpYmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQWtEO0FBQ2xELG1DQUF5RDtBQUVsRCxNQUFNLGFBQWEsR0FBRyxDQUFDLEdBQWdCLEVBQUUsR0FBcUIsRUFBRSxXQUFtQixDQUFDLENBQUMsRUFBRSxFQUFFO0lBQzlGLE1BQU0sTUFBTSxHQUFzQixFQUFFLENBQUM7SUFDckMsTUFBTSxTQUFTLEdBQUcsQ0FBQyxHQUFnQixFQUFFLEdBQXFCLEVBQUUsUUFBZ0IsQ0FBQyxFQUFFLEVBQUU7UUFDL0UsTUFBTSxDQUFDLEdBQUcsSUFBQSx5QkFBaUIsRUFBQyxHQUFHLENBQUMsQ0FBQztRQUNqQyxJQUFJLElBQUEsYUFBSyxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDYixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7Z0JBQ3RCLEtBQUssRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUFFLEVBQUU7b0JBQ2pCLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO3dCQUNkLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztvQkFDckIsQ0FBQztnQkFDSCxDQUFDO2dCQUNELEtBQUssRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUFFLEVBQUU7b0JBQ2pCLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO3dCQUNkLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztvQkFDckIsQ0FBQztnQkFDSCxDQUFDO2FBQ0YsQ0FBQyxDQUFDLENBQUM7WUFFSixJQUFJLEtBQUssR0FBRyxRQUFRLEVBQUUsQ0FBQztnQkFDckIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9ELENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQyxDQUFBO0lBRUQsU0FBUyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFdkIsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyxDQUFDO0FBM0JXLFFBQUEsYUFBYSxpQkEyQnhCIn0=