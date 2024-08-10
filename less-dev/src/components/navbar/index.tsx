import { ljsx } from "less";
import { useModals } from "../modal/hook";
import { Button } from "../button";
import { useToasts } from "../toast/hook";
import { useRouter } from "../router/hooks";

export const NavBar = () => {
  const modals = useModals();
  const toasts = useToasts();
  const router = useRouter();

  return (
    <div class="w-full h-[4rem] px-2 bg-gray-600 text-white flex-none flex flex-row" style={{
      justifyContent: 'space-between'
    }}>
      <div class="justify-start flex items-center gap-[1rem] h-full">
        {
          router.router.value.routes.map((route) => {
            return <a class="text-sky-200 hover:text-white" href={route.value.path}>{route.value.name || route.value.path}</a>
          })
        }
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
