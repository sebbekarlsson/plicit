"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepSubscribe = void 0;
const proxy_1 = require("./proxy");
const types_1 = require("./types");
const deepSubscribe = (dep, sub, maxDepth = -1) => {
    const subscribe = (dep, sub, depth = 0) => {
        const d = (0, types_1.unwrapReactiveDep)(dep);
        if ((0, proxy_1.isRef)(d)) {
            d.subscribe({
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
            });
            if (depth < maxDepth) {
                d._deps.forEach((child) => subscribe(child, sub, depth + 1));
            }
        }
    };
    subscribe(dep, sub, 0);
};
exports.deepSubscribe = deepSubscribe;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Vic2NyaWJlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3BsaWNpdC9zdWJzY3JpYmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQWtEO0FBQ2xELG1DQUF5RDtBQUVsRCxNQUFNLGFBQWEsR0FBRyxDQUFDLEdBQWdCLEVBQUUsR0FBcUIsRUFBRSxXQUFtQixDQUFDLENBQUMsRUFBRSxFQUFFO0lBQzlGLE1BQU0sU0FBUyxHQUFHLENBQUMsR0FBZ0IsRUFBRSxHQUFxQixFQUFFLFFBQWdCLENBQUMsRUFBRSxFQUFFO1FBQy9FLE1BQU0sQ0FBQyxHQUFHLElBQUEseUJBQWlCLEVBQUMsR0FBRyxDQUFDLENBQUM7UUFDakMsSUFBSSxJQUFBLGFBQUssRUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ2IsQ0FBQyxDQUFDLFNBQVMsQ0FBQztnQkFDVixLQUFLLEVBQUUsQ0FBQyxHQUFHLElBQUksRUFBRSxFQUFFO29CQUNqQixJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDZCxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7b0JBQ3JCLENBQUM7Z0JBQ0gsQ0FBQztnQkFDRCxLQUFLLEVBQUUsQ0FBQyxHQUFHLElBQUksRUFBRSxFQUFFO29CQUNqQixJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDZCxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7b0JBQ3JCLENBQUM7Z0JBQ0gsQ0FBQzthQUNGLENBQUMsQ0FBQztZQUVILElBQUksS0FBSyxHQUFHLFFBQVEsRUFBRSxDQUFDO2dCQUNyQixDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0QsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDLENBQUE7SUFFRCxTQUFTLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6QixDQUFDLENBQUM7QUF4QlcsUUFBQSxhQUFhLGlCQXdCeEIifQ==