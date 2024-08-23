import { signal } from "plicit";
import { Button } from "../../../components/button";
import { useTooltip } from "../../../components/tooltip/hooks/useTooltip";
import { Tooltip } from "../../../components/tooltip";

export default () => {
  const triggerRef = signal(undefined);
  const tooltip = useTooltip({
    triggerRef,
    body: () => <div class="p-4">I am a tooltip!</div>,
  });

  return (
    <div>
      <Button ref={triggerRef}>With Tooltip</Button>
      <Tooltip hook={tooltip} />
    </div>
  );
};
