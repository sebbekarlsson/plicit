"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInterpolation = void 0;
const tsmathutil_1 = require("tsmathutil");
const reactivity_1 = require("../reactivity");
const useInterpolation = (props) => {
    const value = (0, reactivity_1.signal)(props.initial ?? 0);
    let timer = null;
    const stopInterpolation = () => {
        if (timer === null)
            return;
        cancelAnimationFrame(timer);
        timer = null;
    };
    const run = (args) => {
        stopInterpolation();
        const duration = Math.max(args.duration || props.duration, 0.001);
        const startValue = args.from ?? props.initial ?? value.get();
        const endValue = args.to;
        let timeStarted = -1;
        let lastTime = -1;
        return new Promise((resolve) => {
            const loop = (time) => {
                if (timer === null) {
                    resolve();
                    return;
                }
                if (timeStarted < 0) {
                    timeStarted = time;
                    lastTime = time;
                }
                const delta = (time - lastTime) / 1000;
                lastTime = time;
                const elapsed = (time - timeStarted) / 1000;
                if (!props.infinite && elapsed >= duration) {
                    resolve();
                    if (args.callback) {
                        args.callback(endValue);
                    }
                    value.set(() => endValue);
                    return;
                }
                const f = (0, tsmathutil_1.clamp)(elapsed / duration, 0, 1);
                const nextValue = (0, tsmathutil_1.lerp)(startValue, endValue, f);
                if (args.callback) {
                    args.callback(nextValue);
                }
                if (args.eachFrame) {
                    args.eachFrame(time, delta);
                }
                if (props.eachFrame) {
                    props.eachFrame(time, delta);
                }
                value.set(() => nextValue);
                timer = requestAnimationFrame(loop);
            };
            timer = requestAnimationFrame(loop);
        });
    };
    if (props.immediate) {
        run({
            from: props.initial ?? 0,
            to: 1.0,
        });
    }
    return { run, stop: stopInterpolation, value };
};
exports.useInterpolation = useInterpolation;
//# sourceMappingURL=useInterpolation.js.map