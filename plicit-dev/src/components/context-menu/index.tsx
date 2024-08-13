import { Component } from "plicit";
import { IContextMenuItem, IContextMenuProps } from "./types";

export const ContextMenu: Component<IContextMenuProps> = (props) => {
  const handleClickItem = async (item: IContextMenuItem) => {
    if (item.action) {
      item.action();
    }
  };

  return () => (
    <div
      class="bg-white shadow-lg select-none rounded-lg overflow-hidden"
      style={props.hook.style.value}
      deps={[props.hook.style]}
      ref={props.hook.menuRef}
    >
      {props.hook.menu.value.sections.map((sec) => {
        return (
          <div>
            {sec.label && <div>{sec.label}</div>}
            {sec.items.map((item) => {
              return (
                <div
                  class="w-full h-[3rem] px-2 flex items-center cursor-pointer hover:bg-gray-100 hover:text-blue-500"
                  on={{
                    click: () => handleClickItem(item),
                  }}
                >
                  {item.label}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
