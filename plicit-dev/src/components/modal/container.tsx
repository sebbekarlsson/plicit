import { Modal } from ".";
import { computed, lerp, lnode } from "../../../../plicit/src";
import { useModals } from "./hook";
import { ljsx } from "plicit";

export const ModalContainer = () => {
  const modals = useModals();

  const interpolation = computed(
    () =>
      modals.modals.value.length <= 0
        ? 0
        : Math.max(
            ...modals.modals.value.map(
              (modal) => modal.value.animation.value.value,
            ),
          ),

    [
      modals.modals,
      ...modals.modals.value.map((modal) => modal.value.animation.value),
    ],
  );

  const opacity = computed(() => {
    return lerp(0.0, 0.5, interpolation.value);
  }, [interpolation]); 

  return () => (
    <div
      deps={[modals.modals, opacity]}
      style={{
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
      }}
    >
      {() => (
        <div
          style={{
            position: "fixed",
            top: "0px",
            left: "0px",
            width: "100vw",
            height: "100vh",
            background: `rgba(0, 0, 0, ${opacity.value})`,
          }}
          deps={[opacity]}
        />
      )}
      {modals.modals.value.map((modal, i) => {
        return <Modal deps={[modal]} modal={modal} index={i} />;
      })}
    </div>
  );
};
