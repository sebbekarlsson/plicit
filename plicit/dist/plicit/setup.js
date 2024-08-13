"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = void 0;
const lnode_1 = require("./lnode");
const setup = (component, el) => {
    const main = (0, lnode_1.lnode)('div', {
        children: [
            component
        ]
    });
    main.mountTo(el);
};
exports.setup = setup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGxpY2l0L3NldHVwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLG1DQUFnQztBQUV6QixNQUFNLEtBQUssR0FBRyxDQUFDLFNBQW9CLEVBQUUsRUFBeUIsRUFBRSxFQUFFO0lBQ3ZFLE1BQU0sSUFBSSxHQUFHLElBQUEsYUFBSyxFQUFDLEtBQUssRUFBRTtRQUN4QixRQUFRLEVBQUU7WUFDUixTQUFTO1NBQ1Y7S0FDRixDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ25CLENBQUMsQ0FBQTtBQVJZLFFBQUEsS0FBSyxTQVFqQiJ9