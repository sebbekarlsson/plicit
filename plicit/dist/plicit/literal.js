"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.literal = literal;
const proxy_1 = require("./proxy");
function literal(strings, ...args) {
    return String.raw({ raw: strings }, ...args.map(arg => {
        if ((0, proxy_1.isRef)(arg)) {
            return arg.value;
        }
        return arg;
    }));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGl0ZXJhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wbGljaXQvbGl0ZXJhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLDBCQVFDO0FBVkQsbUNBQWdDO0FBRWhDLFNBQWdCLE9BQU8sQ0FBQyxPQUE2QixFQUFFLEdBQUcsSUFBVztJQUVuRSxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ3BELElBQUksSUFBQSxhQUFLLEVBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUNmLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQztRQUNuQixDQUFDO1FBQ0QsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ04sQ0FBQyJ9