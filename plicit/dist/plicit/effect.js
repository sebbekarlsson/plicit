"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.effect = void 0;
const proxy_1 = require("./proxy");
const types_1 = require("./types");
const effect = (fun, deps = []) => {
    deps.forEach((dep) => {
        const d = (0, types_1.unwrapReactiveDep)(dep);
        if ((0, proxy_1.isRef)(d)) {
            d.subscribe({
                onSet: () => {
                    fun();
                },
                onGet: () => { },
            });
        }
    });
};
exports.effect = effect;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWZmZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3BsaWNpdC9lZmZlY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQWdDO0FBQ2hDLG1DQUF5RDtBQUtsRCxNQUFNLE1BQU0sR0FBRyxDQUNwQixHQUFpQixFQUNqQixPQUFzQixFQUFFLEVBQ3hCLEVBQUU7SUFDRixJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7UUFDbkIsTUFBTSxDQUFDLEdBQUcsSUFBQSx5QkFBaUIsRUFBQyxHQUFHLENBQUMsQ0FBQztRQUNqQyxJQUFJLElBQUEsYUFBSyxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDYixDQUFDLENBQUMsU0FBUyxDQUFDO2dCQUNWLEtBQUssRUFBRSxHQUFHLEVBQUU7b0JBQ1YsR0FBRyxFQUFFLENBQUM7Z0JBQ1IsQ0FBQztnQkFDRCxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUUsQ0FBQzthQUNoQixDQUFDLENBQUM7UUFDTCxDQUFDO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUM7QUFmVyxRQUFBLE1BQU0sVUFlakIifQ==