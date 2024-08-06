import { ljsx } from 'less';
import { useModals } from "../modal/hook";
import { Button } from '../button';
import { useToasts } from '../toast/hook';


export const NavBar = () => {
  const modals = useModals();
  const toasts = useToasts();

  return <div class="w-full h-[4rem] justify-end flex items-center px-2 bg-gray-600 text-white flex-none gap-[1rem]">
    <Button on={{
      click: () => {
            modals.push({
              title: "Hello",
              body: () => <div>This is a modal!</div>,
            });
          }
    }}>Modal</Button>

    <Button on={{
      click: () => {
        toasts.push({
          message: 'I am a toast!'
        })
          }
    }}>Toast</Button>
  </div>;
};
