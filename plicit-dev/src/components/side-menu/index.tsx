import { Component, computed } from "plicit";
import { ISideMenuProps } from "./types";
import { useRoute } from "../router/hooks";

export const SideMenu: Component<ISideMenuProps> = (props) => {
  const route = useRoute();
  return (
    <div class="h-full bg-amaranth-900 text-white select-none">
      {props.menu.sections.map((sec) => {
        return (
          <div class="w-full">
            {sec.label && <div class="w-full h-[4rem] flex items-center px-4 text-lg bg-amaranth-700">{sec.label}</div>}
            <div class="w-full">
              {sec.items.map((it) => {
                const isActive = computed(() => route.value.path === it.path, [route])
                
                return (
                  () => <div
                    class={"w-full h-[2.7rem] px-4 flex items-center hover:bg-amaranth-500 cursor-pointer transition-all" + (isActive.value ? ` bg-amaranth-500` : ``)}
                          on={{ click: it.action }}
                          deps={[isActive]}
                  >
                    {it.label}
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
