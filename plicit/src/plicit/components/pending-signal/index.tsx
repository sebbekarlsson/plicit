import { Component } from "../../component";
import { CSSProperties } from "../../css";
import { useInterpolation } from "../../hooks";
import { computedSignal } from "../../reactivity";
import { onUnmounted } from "../../scope";

export const PendingSignal: Component = () => {
  const interp = useInterpolation({
    duration: 1.0,
    infinite: true,
    initial: 0,
    immediate: true,
  });

  onUnmounted(() => {
    interp.stop();
  });

  const style = computedSignal((): CSSProperties => {
    const rot = (interp.value.get() % (Math.PI * 2)) * 360;
    return {
      transform: `rotate(${rot}deg)`,
      transformOrigin: "center",
    };
  });

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
        opacity=".25"
      />
      <path
        d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
        style={style}
        class="spinner_ajPY"
      />
    </svg>
  );
};
