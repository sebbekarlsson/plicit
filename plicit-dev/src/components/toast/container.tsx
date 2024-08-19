import { Component, computedSignal, ELNodeType } from "plicit";
import { useToasts } from "./hook";
import { Toast } from ".";

export const ToastContainer: Component = () => {
  const toasts = useToasts();

  return () => (
    <div
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
      {computedSignal(() => {
        return (
          <div nodeType={ELNodeType.FRAGMENT}>
            {toasts.toasts.get().map((toast, i) => {
              return <Toast toast={toast} key={`toast-${i}`} />;
            })}
          </div>
        );
      })}
    </div>
  );
};
