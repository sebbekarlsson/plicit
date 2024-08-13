"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAsyncFunction = exports.isFunction = exports.isConsonant = exports.isVowel = exports.isFloat = void 0;
const isFloat = (x) => typeof x === "number" && x.toString().includes(".");
exports.isFloat = isFloat;
const isVowel = (char) => {
    char = char.toLowerCase();
    const vowels = ["a", "e", "i", "o", "u"];
    return vowels.includes(char);
};
exports.isVowel = isVowel;
const isConsonant = (char) => {
    return !(0, exports.isVowel)(char);
};
exports.isConsonant = isConsonant;
const isFunction = (x) => typeof x === 'function';
exports.isFunction = isFunction;
const isAsyncFunction = (x) => {
    if (!x)
        return false;
    if (typeof x !== 'function')
        return false;
    if (typeof x.constructor !== 'function')
        return false;
    return x.constructor.name == 'AsyncFunction';
};
exports.isAsyncFunction = isAsyncFunction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGxpY2l0L2lzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFPLE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBTSxFQUFlLEVBQUUsQ0FDN0MsT0FBTyxDQUFDLEtBQUssUUFBUSxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7QUFEekMsUUFBQSxPQUFPLFdBQ2tDO0FBRS9DLE1BQU0sT0FBTyxHQUFHLENBQUMsSUFBWSxFQUFXLEVBQUU7SUFDL0MsSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUMxQixNQUFNLE1BQU0sR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN6QyxPQUFPLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0IsQ0FBQyxDQUFDO0FBSlcsUUFBQSxPQUFPLFdBSWxCO0FBRUssTUFBTSxXQUFXLEdBQUcsQ0FBQyxJQUFZLEVBQVcsRUFBRTtJQUNuRCxPQUFPLENBQUMsSUFBQSxlQUFPLEVBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEIsQ0FBQyxDQUFBO0FBRlksUUFBQSxXQUFXLGVBRXZCO0FBRU0sTUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFNLEVBQWlCLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxVQUFVLENBQUM7QUFBaEUsUUFBQSxVQUFVLGNBQXNEO0FBR3RFLE1BQU0sZUFBZSxHQUFHLENBQVUsQ0FBTSxFQUFvQixFQUFFO0lBQ25FLElBQUksQ0FBQyxDQUFDO1FBQUUsT0FBTyxLQUFLLENBQUM7SUFDckIsSUFBSSxPQUFPLENBQUMsS0FBSyxVQUFVO1FBQUUsT0FBTyxLQUFLLENBQUM7SUFDMUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxXQUFXLEtBQUssVUFBVTtRQUFFLE9BQU8sS0FBSyxDQUFDO0lBQ3RELE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLElBQUksZUFBZSxDQUFDO0FBQy9DLENBQUMsQ0FBQTtBQUxZLFFBQUEsZUFBZSxtQkFLM0IifQ==