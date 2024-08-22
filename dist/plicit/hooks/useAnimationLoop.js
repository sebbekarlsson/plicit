"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAnimationLoop = void 0;
const useAnimationLoop = (fun) => {
    let timer = null;
    let paused = false;
    let lastTime = -1;
    const loop = (time) => {
        if (paused)
            return;
        if (lastTime < 0) {
            lastTime = time;
        }
        const delta = (time - lastTime) / 1000;
        lastTime = time;
        fun(time, delta);
        timer = requestAnimationFrame(loop);
    };
    const start = () => {
        if (timer !== null && paused !== true) {
            return;
        }
        if (paused) {
            paused = false;
            loop(lastTime);
            return;
        }
        timer = requestAnimationFrame(loop);
    };
    const pause = () => {
        paused = true;
    };
    const kill = () => {
        lastTime = -1;
        paused = false;
        if (timer !== null) {
            cancelAnimationFrame(timer);
            timer = null;
        }
    };
    return { start, pause, kill };
};
exports.useAnimationLoop = useAnimationLoop;
//# sourceMappingURL=useAnimationLoop.js.map