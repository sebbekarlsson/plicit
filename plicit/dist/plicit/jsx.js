"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ljsx = ljsx;
const component_1 = require("./component");
const lnode_1 = require("./lnode");
const proxy_1 = require("./proxy");
const signal_1 = require("./signal");
function ljsx(tag, attribs, ...childs) {
    const children = childs
        .map((child) => (typeof child === "string" || typeof child === 'number')
        ? (0, lnode_1.lnode)("span", { text: child + '', nodeType: lnode_1.ELNodeType.TEXT_ELEMENT })
        : child)
        .flat()
        .filter((it) => (0, lnode_1.isLNode)(it) || (0, component_1.isComponent)(it) || (0, proxy_1.isRef)(it) || (0, signal_1.isSignal)(it));
    if ((0, component_1.isComponent)(tag)) {
        return () => tag({ ...attribs, children: children });
    }
    return (0, lnode_1.lnode)(tag, { ...attribs, children: children });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianN4LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3BsaWNpdC9qc3gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQSxvQkFtQkM7QUF4QkQsMkNBQXFEO0FBQ3JELG1DQUFzRTtBQUN0RSxtQ0FBZ0M7QUFDaEMscUNBQW9DO0FBRXBDLFNBQWdCLElBQUksQ0FDbEIsR0FBdUIsRUFDdkIsT0FBd0IsRUFDeEIsR0FBRyxNQUFhO0lBRWhCLE1BQU0sUUFBUSxHQUFHLE1BQU07U0FDcEIsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FDYixDQUFDLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUM7UUFDdEQsQ0FBQyxDQUFDLElBQUEsYUFBSyxFQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEdBQUcsRUFBRSxFQUFFLFFBQVEsRUFBRSxrQkFBVSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3hFLENBQUMsQ0FBQyxLQUFLLENBQ1Y7U0FDQSxJQUFJLEVBQUU7U0FDTixNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUEsZUFBTyxFQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUEsdUJBQVcsRUFBQyxFQUFFLENBQUMsSUFBSSxJQUFBLGFBQUssRUFBQyxFQUFFLENBQUMsSUFBSSxJQUFBLGlCQUFRLEVBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUUvRSxJQUFJLElBQUEsdUJBQVcsRUFBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQ3JCLE9BQU8sR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVELE9BQU8sSUFBQSxhQUFLLEVBQUMsR0FBRyxFQUFFLEVBQUUsR0FBRyxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFDeEQsQ0FBQyJ9