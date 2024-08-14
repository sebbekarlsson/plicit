"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = void 0;
const lnode_1 = require("./lnode");
const setup = (component, el) => {
    const main = (0, lnode_1.lnode)('div', {
        nodeType: lnode_1.ELNodeType.FRAGMENT,
        children: [
            component
        ]
    });
    main.mountTo(el);
};
exports.setup = setup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGxpY2l0L3NldHVwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLG1DQUE0QztBQUVyQyxNQUFNLEtBQUssR0FBRyxDQUFDLFNBQW9CLEVBQUUsRUFBeUIsRUFBRSxFQUFFO0lBQ3ZFLE1BQU0sSUFBSSxHQUFHLElBQUEsYUFBSyxFQUFDLEtBQUssRUFBRTtRQUN4QixRQUFRLEVBQUUsa0JBQVUsQ0FBQyxRQUFRO1FBQzdCLFFBQVEsRUFBRTtZQUNSLFNBQVM7U0FDVjtLQUNGLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbkIsQ0FBQyxDQUFBO0FBVFksUUFBQSxLQUFLLFNBU2pCIn0=