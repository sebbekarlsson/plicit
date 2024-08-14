import {
  computed,
  CSSProperties,
  effect,
  isHTMLElement,
  LNodeRef,
  Ref,
  ref,
  signal,
} from "plicit";
import { IContextMenu, IContextMenuConfig } from "../types";
import { AABB, getAABBSize, VEC2 } from "tsmathutil";
import { useInterpolationSignal } from "../../../hooks/useInterpolationSignal";

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
  menu: Ref<IContextMenu>;
  style: Ref<CSSProperties>;
  menuRef: LNodeRef;
};

export const useContextMenu = (props: UseContextMenuProps): UseContextMenu => {
  const menu = ref<IContextMenu>({
    ...props.menu,
    pos: VEC2(0, 0),
    open: false,
  });

  const interp = useInterpolationSignal({
    duration: 0.15,
    initial: 0,
  });

  const mouseIsOnMenu = signal<boolean>(false);
  const mouseIsOnTrigger = signal<boolean>(false);

  const menuRef: LNodeRef = ref(undefined);

  const triggerEl = computed((): HTMLElement | null => {
    const trigger = props.triggerRef.value;
    if (!trigger) return null;
    const el = trigger.el;
    if (!isHTMLElement(el)) return null;
    return el;
  }, [props.triggerRef]);

  const menuEl = computed((): HTMLElement | null => {
    const node = menuRef.value;
    if (!node) return null;
    const el = node.el;
    if (!isHTMLElement(el)) return null;
    return el;
  }, [menuRef]);

  const triggerBounds = computed((): AABB => {
    const empty: AABB = { min: VEC2(0, 0), max: VEC2(1, 1) };
    const el = triggerEl.value;
    if (!el) return empty;
    const box = el.getBoundingClientRect();
    const p = VEC2(box.x, box.y);
    const size = VEC2(box.width, box.height);
    return {
      min: p,
      max: p.add(size),
    };
  }, [mouseIsOnMenu, mouseIsOnTrigger]);

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
    menu.value = {
      ...menu.value,
      open,
    };
  };

  const toggleOpen = () => {
    setOpen(!menu.value.open);
  };

  const style = computed((): CSSProperties => {
    const p = triggerBounds.value.min.clone();
    p.y = triggerBounds.value.max.y;
    const size = getAABBSize(triggerBounds.value);
    const anim = interp.value.get();
    return {
      position: "fixed",
      left: p.x + "px",
      top: p.y + "px",
      zIndex: "9999",
      minWidth: size.x + "px",
      background: "white",
      opacity: anim * 100 + "%",
      ...(menu.value.open || anim > 0.001
        ? {
            display: "block",
          }
        : {
            display: "none",
            pointerEvents: "none",
            opacity: "0%",
          }),
    };
  }, [menu, triggerBounds, interp.value]);

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

  effect(() => {
    const el = triggerEl.value;
    if (!el) return;
    el.addEventListener("mouseenter", onMouseEnterTrigger);
    el.addEventListener("mouseleave", onMouseLeaveTrigger);
  }, [triggerEl]);

  effect(() => {
    const el = menuEl.value;
    if (!el) return;
    el.addEventListener("mouseenter", onMouseEnterMenu);
    el.addEventListener("mouseleave", onMouseLeaveMenu);
  }, [menuEl]);

  return {
    menu,
    setOpen,
    toggleOpen,
    style,
    menuRef,
  };
};
