import { Modal } from ".";
import {
  computedSignal,
  CSSProperties,
  lerp,
  signal,
  useInterpolation,
  watchSignal,
} from "../../../../plicit/src";
import { useModals } from "./hook";
import { ljsx } from "plicit";

export const ModalContainer = () => {
  const modals = useModals();
  const didStart = signal<boolean>(false);

  const modalCount = computedSignal(() => modals.modals.get().length);
  const interp = useInterpolation({
    duration: 0.25,
    initial: 0,
  });

  watchSignal(modalCount, (count) => {
    if (count > 0 && !didStart.get()) {
      interp.run({ to: 1.0, from: 0.0 });
      didStart.set(true);
    } else if (count <= 0 && didStart.get()) {
      interp.run({ to: 0.0, from: 1.0 });
      didStart.set(false);
    }
  });

  const opacity = computedSignal(() => {
    modals.modals.get();
    return lerp(0.0, 0.5, interp.value.get());
  });

  return (
    <div
      style={computedSignal(
        (): CSSProperties => ({
          width: "100vw",
          height: "100vh",
          position: "fixed",
          left: "0px",
          top: "0px",
          zIndex: "300",
          pointerEvents: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: `rgba(0, 0, 0, ${opacity.get() * 100}%)`,
        }),
      )}
    >
      {computedSignal(() => {
        return (
          <div>
            {modals.modals.get().map((modal, i) => {
              return <Modal modal={modal} index={i} />;
            })}
          </div>
        );
      })}
    </div>
  );
};
