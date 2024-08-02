import { ljsx } from 'less';
import { useModals } from "../modal/hook";
import { Button } from '../button';


export const NavBar = () => {
  const modals = useModals();

  return <div class="w-full h-[4rem] justify-end flex items-center px-2 bg-gray-600 text-white flex-none">
    <Button on={{
      click: () => {
            modals.push({
              title: "Hello",
              body: () => <div>This is a modal!</div>,
            });
          }
    }}>Modal</Button>
  </div>;
};
