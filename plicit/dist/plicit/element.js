"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchElements = exports.getElementsDiff = exports.getElementsAttributesDiff = exports.getElementAttributes = void 0;
const getElementAttributes = (a) => {
    return Array.from(a.attributes);
};
exports.getElementAttributes = getElementAttributes;
const getElementsAttributesDiff = (a, b) => {
    const attributesB = (0, exports.getElementAttributes)(b).map((attr) => [attr.name, attr.value]);
    return attributesB.filter(([key, value]) => a.getAttribute(key) !== value);
};
exports.getElementsAttributesDiff = getElementsAttributesDiff;
const getElementsDiff = (a, b) => {
    return (0, exports.getElementsAttributesDiff)(a, b);
};
exports.getElementsDiff = getElementsDiff;
const patchElements = (old, nextEl, attributeCallback) => {
    if (old.innerHTML !== nextEl.innerHTML) {
        old.replaceWith(nextEl);
        return nextEl;
    }
    else {
        const diff = (0, exports.getElementsAttributesDiff)(old, nextEl);
        diff.forEach(([key, value]) => {
            if (attributeCallback) {
                attributeCallback([key, value]);
            }
            old.setAttribute(key, value);
            old[key] = value;
        });
        return old;
    }
};
exports.patchElements = patchElements;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlbWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wbGljaXQvZWxlbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBTyxNQUFNLG9CQUFvQixHQUFHLENBQUMsQ0FBYyxFQUFVLEVBQUU7SUFDN0QsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNsQyxDQUFDLENBQUM7QUFGVyxRQUFBLG9CQUFvQix3QkFFL0I7QUFJSyxNQUFNLHlCQUF5QixHQUFHLENBQ3ZDLENBQWMsRUFDZCxDQUFjLEVBQ0UsRUFBRTtJQUNsQixNQUFNLFdBQVcsR0FBRyxJQUFBLDRCQUFvQixFQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FDN0MsQ0FBQyxJQUFJLEVBQVcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQzNDLENBQUM7SUFDRixPQUFPLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQztBQUM3RSxDQUFDLENBQUM7QUFSVyxRQUFBLHlCQUF5Qiw2QkFRcEM7QUFFSyxNQUFNLGVBQWUsR0FBRyxDQUFDLENBQWMsRUFBRSxDQUFjLEVBQUUsRUFBRTtJQUNoRSxPQUFPLElBQUEsaUNBQXlCLEVBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3pDLENBQUMsQ0FBQztBQUZXLFFBQUEsZUFBZSxtQkFFMUI7QUFFSyxNQUFNLGFBQWEsR0FBRyxDQUMzQixHQUFnQixFQUNoQixNQUFtQixFQUNuQixpQkFBMkMsRUFDM0MsRUFBRTtJQUNGLElBQUksR0FBRyxDQUFDLFNBQVMsS0FBSyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDdkMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4QixPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO1NBQU0sQ0FBQztRQUNOLE1BQU0sSUFBSSxHQUFHLElBQUEsaUNBQXlCLEVBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFO1lBQzVCLElBQUksaUJBQWlCLEVBQUUsQ0FBQztnQkFDdEIsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNsQyxDQUFDO1lBQ0QsR0FBRyxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDNUIsR0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQztBQUNILENBQUMsQ0FBQztBQXBCVyxRQUFBLGFBQWEsaUJBb0J4QiJ9