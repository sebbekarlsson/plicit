import {
  computed,
  CSSProperties,
  effect,
  isHTMLElement,
  LNodeRef,
  Ref,
  ref,
} from "plicit";
import { IContextMenu, IContextMenuConfig } from "../types";
import { AABB, getAABBSize, VEC2 } from "tsmath";
import { useInterpolation } from "../../../hooks/useInterpolation";

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

  const interp = useInterpolation({
    duration: 0.15,
    initial: 0,
  });

  const mouseIsOnMenu = ref<boolean>(false);
  const mouseIsOnTrigger = ref<boolean>(false);

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
  }, [triggerEl, props.triggerRef]);

  const setOpen = (open: boolean) => {
    if (open) {
      interp.run({
        to: 1.0,
        from: interp.value.value,
      });
    } else {
      interp.run({
        to: 0.0,
        from: interp.value.value,
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

    return {
      position: "fixed",
      left: p.x + "px",
      top: p.y + "px",
      zIndex: "9999",
      minWidth: size.x + "px",
      background: "white",
      opacity: interp.value.value * 100 + "%",
      ...(menu.value.open || interp.value.value > 0.001
        ? {
            display: "block",
          }
        : {
            display: "none",
            pointerEvents: "none",
            opacity: "0%",
          }),
    };
  }, [menu, triggerBounds, triggerEl, interp.value, mouseIsOnTrigger, mouseIsOnMenu]);

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
    mouseIsOnTrigger.value = true;

    setOpen(true);
  };

  const onMouseLeaveTrigger = () => {
    mouseIsOnTrigger.value = false;

    leaveTriggerTimer = setTimeout(() => {
      if (mouseIsOnTrigger.value || mouseIsOnMenu.value) return;
      setOpen(false);
    }, HOVER_TIMEOUT_LEAVE_TRIGGER);
  };

  const onMouseEnterMenu = () => {
    cancelTimers();
    mouseIsOnMenu.value = true;
  };

  const onMouseLeaveMenu = () => {
    mouseIsOnMenu.value = false;

    

    leaveMenuTimer = setTimeout(() => {
      if (mouseIsOnTrigger.value || mouseIsOnMenu.value) return;
      setOpen(false);
    }, HOVER_TIMEOUT_LEAVE_MENU);
  };

  effect(() => {
    const el = triggerEl.value;
    if (!el) return;
    el.addEventListener("mouseenter", onMouseEnterTrigger);
    el.addEventListener("mouseleave", onMouseLeaveTrigger);
    mouseIsOnMenu.value = false;
    mouseIsOnTrigger.value = false;
  }, [triggerEl]);

  effect(() => {
    const el = menuEl.value;
    if (!el) return;
    el.addEventListener("mouseenter", onMouseEnterMenu);
    el.addEventListener("mouseleave", onMouseLeaveMenu);
    mouseIsOnMenu.value = false;
    mouseIsOnTrigger.value = false;
  }, [menuEl]);

  return {
    menu,
    setOpen,
    toggleOpen,
    style,
    menuRef,
  };
};
