import { ljsx, LNodeRef, ref } from "plicit";
import { useModals } from "../modal/hook";
import { Button } from "../button";
import { useToasts } from "../toast/hook";
import { useContextMenu } from "../context-menu/hooks/useContextMenu";
import { ContextMenu } from "../context-menu";

export const NavBar = () => {
  const modals = useModals();
  const toasts = useToasts();

  const elRef: LNodeRef = ref(undefined);

  const ctxMenu = useContextMenu({
    triggerRef: elRef,
    menu: {
      sections: [
        {
          items: [
            { label: 'Item 1' },
            { label: 'Item 2' },
            { label: 'Item 3' },
            { label: 'Item 4' }
          ]
        }
      ]
    }
  });


  return (
    <div class="w-full h-[4rem] px-4 bg-primary-950 text-white flex-none flex flex-row select-none" style={{
      justifyContent: 'space-between',
    }}>
      <div class="justify-start flex items-center gap-[1rem] h-full">
      </div>
      <div class="justify-end flex items-center gap-[1rem] h-full">
        <Button
          ref={elRef}
        >
          Dropdown
        </Button>
        <Button
          on={{
            click: () => {
              modals.push({
                title: "Hello",
                body: () => <div>This is a modal!</div>,
              });
            },
          }}
        >
          Modal
        </Button>

        <Button
          on={{
            click: () => {
              toasts.push({
                message: "I am a toast!",
              });
            },
          }}
        >
          Toast
        </Button>
      </div>
      {() => <ContextMenu hook={ctxMenu}/>}
    </div>
  );
};
