import { LNodeRef, ref, signal } from "plicit";
import { PageContent } from "../../../layouts/page-content"
import { useContextMenu } from "../../../components/context-menu/hooks/useContextMenu";
import { Button } from "../../../components/button";
import { ContextMenu } from "../../../components/context-menu";

export default () => {

  const elRef: LNodeRef = signal(undefined);

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
  
  return <PageContent>
    <Button ref={elRef}>With Menu</Button>
    <ContextMenu hook={ctxMenu}/>
  </PageContent>
}
