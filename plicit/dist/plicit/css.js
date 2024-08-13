"use strict";
//export type CSSProperties = {};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cssPropsToString = void 0;
const kebab = (str) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
const cssPropsToString = (props) => {
    return Object.entries(props).map(([key, value]) => {
        return `${kebab(key)}: ${value}`;
    }).join(';');
};
exports.cssPropsToString = cssPropsToString;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3NzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3BsaWNpdC9jc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGlDQUFpQzs7O0FBSWpDLE1BQU0sS0FBSyxHQUFHLENBQUMsR0FBVyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBRTlFLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxLQUFvQixFQUFVLEVBQUU7SUFDL0QsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUU7UUFDaEQsT0FBTyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxLQUFLLEVBQUUsQ0FBQztJQUNuQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDZCxDQUFDLENBQUE7QUFKWSxRQUFBLGdCQUFnQixvQkFJNUIifQ==