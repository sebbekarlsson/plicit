import { ljsx } from "plicit";
import { useModals } from "../modal/hook";
import { Button } from "../button";
import { useToasts } from "../toast/hook";

export const NavBar = () => {
  const modals = useModals();
  const toasts = useToasts();
  

  return (
    <div class="w-full h-[4rem] px-4 bg-amaranth-950 text-white flex-none flex flex-row select-none" style={{
      justifyContent: 'space-between'
    }}>
      <div class="justify-start flex items-center gap-[1rem] h-full">
      </div>
      <div class="justify-end flex items-center gap-[1rem] h-full">
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
    </div>
  );
};
