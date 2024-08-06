import { Component, computed } from "less";
import { useToasts } from "./hook";
import { Toast } from ".";

export const ToastContainer: Component = () => {
  const toasts = useToasts();

  return () => (
    <div
      deps={[toasts.toasts]}
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
      {toasts.toasts.value.map((toast, i) => {
        return <Toast deps={[toast]} toast={toast} key={`toast-${i}`} />;
      })}
    </div>
  );
};
