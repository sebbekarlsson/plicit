import { Component, computed, computedSignal, signal } from "plicit";
import { ISideMenuProps } from "./types";
import { useRoute } from "../router/hooks";
import { Icon } from "../icon";

export const SideMenu: Component<ISideMenuProps> = (props) => {
  const route = useRoute();
  const isClosed = computedSignal(() => !props.hook.isOpen.get());
  const xxx = computedSignal(
    () => {
      if (isClosed.get()) {
        return "flex justify-center flex-1 cursor-pointer TEST";
      }
      return "flex justify-end flex-1 cursor-pointer";
    }
  );

  return (
    <div
      class="h-full bg-amaranth-900 text-white select-none"
      style={props.hook.style}
    >
      {() => (
        <div class="w-full h-[2rem] flex items-center px-4">
          {() => (
            <div
              on={{
                click: () => props.hook.toggleOpen(),
              }}
              class={xxx}
            >
              {() => (
                <Icon
                  icon={{
                    src: async () =>
                      import("../../assets/icons/chevron-left.svg"),
                    size: "1rem",
                    fill: "currentColor",
                    flipH: isClosed,
                  }}
                />
              )}
            </div>
          )}
        </div>
      )}
      {props.menu.sections.map((sec) => {
        return (
          <div class="w-full">
            {sec.label && (
              <div class="w-full h-[4rem] flex items-center px-4 text-lg bg-amaranth-700 font-semibold uppercase">
                {sec.label}
              </div>
            )}
            <div class="w-full">
              {sec.items.map((it) => {
                const isActive = computed(
                  () => route.value.path === it.path,
                  [route],
                );

                return () => (
                  <div
                    class={
                      "w-full h-[2.7rem] px-4 hover:bg-amaranth-500 cursor-pointer transition-all" +
                      (isActive.value ? ` bg-amaranth-500` : ``)
                    }
                    style={{
                      display: "grid",
                      alignItems: "center",
                      gap: "1rem",
                      ...(it.icon
                        ? {
                            gridTemplateColumns: "1rem 1fr",
                          }
                        : {}),
                    }}
                    on={{ click: it.action }}
                    deps={[isActive]}
                  >
                    {it.icon && <Icon icon={it.icon} />}
                    <span>{it.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
