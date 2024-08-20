import {
  computedSignal,
  CSSProperties,
  isHTMLElement,
  LNodeRef,
  Signal,
  signal,
  useElementBounds,
  useInterpolation,
  watchSignal,
} from "plicit";
import { IContextMenu, IContextMenuConfig } from "../types";
import { getAABBSize, VEC2 } from "tsmathutil";

const HOVER_TIMEOUT_LEAVE_MENU = 90;
const HOVER_TIMEOUT_LEAVE_TRIGGER = 100;

type Timer = ReturnType<typeof setTimeout>;

export type UseContextMenuProps = {
  menu: IContextMenuConfig;
  triggerRef: LNodeRef;
};

export type UseContextMenu = {
  setOpen: (open: boolean) => void;
  toggleOpen: () => void;
  menu: Signal<IContextMenu>;
  style: Signal<CSSProperties>;
  menuRef: LNodeRef;
};

export const useContextMenu = (props: UseContextMenuProps): UseContextMenu => {
  const menu = signal<IContextMenu>({
    ...props.menu,
    pos: VEC2(0, 0),
    open: false,
  });

  const interp = useInterpolation({
    duration: 0.15,
    initial: 0,
  });

  const mouseIsOnMenu = signal<boolean>(false);
  const mouseIsOnTrigger = signal<boolean>(false);

  const menuRef: LNodeRef = signal(undefined);

  const triggerEl = computedSignal((): HTMLElement | null => {
    const trigger = props.triggerRef.get();
    if (!trigger) return null;
    const el = trigger.el;
    if (!isHTMLElement(el)) return null;
    return el;
  });

  const menuEl = computedSignal((): HTMLElement | null => {
    const node = menuRef.get();
    if (!node) return null;
    const el = node.el;
    if (!isHTMLElement(el)) return null;
    return el;
  });

  const triggerBounds = useElementBounds(props.triggerRef); 

  const setOpen = (open: boolean) => {
    if (open) {
      interp.run({
        to: 1.0,
        from: interp.value.get(),
      });
    } else {
      interp.run({
        to: 0.0,
        from: interp.value.get(),
      });
    }
    menu.set((old) => {
      return {...old, open};
    })
  };

  const toggleOpen = () => {
    setOpen(!menu.get().open);
  };

  const style = computedSignal((): CSSProperties => {
    const trigBounds = triggerBounds.bounds.get();
    const p = trigBounds.min.clone();
    p.y = trigBounds.max.y;
    const size = getAABBSize(trigBounds);
    const anim = interp.value.get();
    return {
      position: "fixed",
      left: p.x + "px",
      top: p.y + "px",
      zIndex: "9999",
      minWidth: size.x + "px",
      background: "white",
      opacity: anim * 100 + "%",
      ...(menu.get().open || anim > 0.001
        ? {
            display: "block",
          }
        : {
            display: "none",
            pointerEvents: "none",
            opacity: "0%",
          }),
    };
  });

  let leaveTriggerTimer: Timer | null = null;
  let leaveMenuTimer: Timer | null = null;

  const cancelTimers = () => {
    if (leaveMenuTimer !== null) {
      clearTimeout(leaveMenuTimer);
      leaveMenuTimer = null;
    }

    if (leaveTriggerTimer !== null) {
      clearTimeout(leaveTriggerTimer);
      leaveTriggerTimer = null;
    }
  }

  const onMouseEnterTrigger = () => {
    cancelTimers();
    mouseIsOnTrigger.set(true);

    setOpen(true);
  };

  const onMouseLeaveTrigger = () => {
    mouseIsOnTrigger.set(false);

    leaveTriggerTimer = setTimeout(() => {
      if (mouseIsOnTrigger.get() || mouseIsOnMenu.get()) return;
      setOpen(false);
    }, HOVER_TIMEOUT_LEAVE_TRIGGER);
  };

  const onMouseEnterMenu = () => {
    cancelTimers();
    mouseIsOnMenu.set(true);
  };

  const onMouseLeaveMenu = () => {
    mouseIsOnMenu.set(false);


    leaveMenuTimer = setTimeout(() => {
      if (mouseIsOnTrigger.get() || mouseIsOnMenu.get()) return;
      setOpen(false);
    }, HOVER_TIMEOUT_LEAVE_MENU);
  };

  watchSignal(triggerEl, (el) => {
    if (!el) return;
    el.addEventListener("mouseenter", onMouseEnterTrigger);
    el.addEventListener("mouseleave", onMouseLeaveTrigger);
  });

  watchSignal(menuEl, (el) => {
    if (!el) return;
    el.addEventListener("mouseenter", onMouseEnterMenu);
    el.addEventListener("mouseleave", onMouseLeaveMenu);
  });

  return {
    menu,
    setOpen,
    toggleOpen,
    style,
    menuRef,
  };
};
