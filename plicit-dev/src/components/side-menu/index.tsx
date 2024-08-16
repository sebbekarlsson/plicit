import {
  Component,
  computed,
  computedSignal,
  CSSProperties,
  lerp,
  none,
  signal,
  Signal,
  smoothstep,
  watchSignal,
} from "plicit";
import { ISideMenuItem, ISideMenuProps } from "./types";
import { useRoute, useRouter } from "../router/hooks";
import { Icon } from "../icon";
import { useInterpolationSignal } from "../../hooks/useInterpolationSignal";

const SectionBanner: Component<{
  item: ISideMenuItem;
  isClosed: Signal<boolean>;
  toggleExpanded: () => void;
}> = (props) => {
  return computedSignal(() => {
    const closed = props.isClosed.get();
    if (closed || !props.item.label) return none();
    return (
      <div
        class="w-full h-[4rem] flex items-center px-4 text-lg bg-amaranth-700 font-semibold uppercase cursor-pointer"
        on={{ click: () => props.toggleExpanded() }}
      >
        {props.item.label}
      </div>
    );
  });
};

const MenuItem: Component<{
  item: ISideMenuItem;
  isClosed: Signal<boolean>;
  depth: number;
}> = (props) => {
  const router = useRouter();
  const route = useRoute();

  const interp = useInterpolationSignal({
    duration: 0.25,
    initial: 0,
  });

  const hasChildren = !!props.item.items && props.item.items.length > 0;
  
  const expanded = signal<boolean>(false);
  const toggleExpanded = () => {
    if (!hasChildren) return;
    expanded.set((x) => {
      return !x;
    });
  };

  if (hasChildren) {
    watchSignal(expanded, (isExpanded) => {
      if (isExpanded) {
        interp.run({ to: 1.0, from: 0.0 });
      } else {
        interp.run({ to: 0.0, from: 1.0 });
      }
    });
  }

  const handleClick = (item: ISideMenuItem) => {
    if (hasChildren) {
      toggleExpanded();
    }
    if (item.action) {
      item.action();
    } else if (item.path) {
      router.push(item.path);
    }
  };

  const isActive = computed(
    () => route.value.path === props.item.path,
    [route],
  );

  const style = computedSignal((): CSSProperties => {
    const closed = props.isClosed.get();
    const layout = closed
      ? "max-content"
      : props.item.icon
        ? "1rem 1fr"
        : "auto";

    const pad = closed ? 0 : (props.depth + 1);
    return {
      paddingLeft: `${pad}rem`,
      display: "grid",
      alignItems: "center",
      gap: "1rem",
      gridTemplateColumns: layout,
      ...(closed
        ? {
            justifyContent: "center",
          }
        : {}),
    };
  });

  const childListStyle = computedSignal<CSSProperties>(() => {
    if (!props.item.items) return {};
    const f = interp.value.get();
    const sf = smoothstep(0.0, 1.0, f);
    const h = lerp(0, 2.7 * (props.item.items || []).length, sf);
    const opacity = lerp(0.0, 100, sf * sf * sf);

    return {
      height: opacity >= 99 ? "auto" : h + "rem",
      opacity: opacity + "%",
      ...(opacity < 50
        ? {
            pointerEvents: "none",
          }
        : {}),
    };
  });

  return () => (
    <div class={"w-full cursor-pointer transition-all"}>
      {computedSignal(() => (
        <div
          on={{ click: () => handleClick(props.item) }}
          class={
            "w-full h-[2.7rem] hover:bg-amaranth-500" +
            (isActive.value ? ` bg-amaranth-500` : ``)
          }
          style={style}
        >
          {props.item.icon && <Icon icon={props.item.icon} />}

          {computedSignal(() =>
            props.isClosed.get() ? none() : <span>{props.item.label}</span>,
          )}
        </div>
      ))}
      {props.item.items && props.item.items.length > 0 && (
        <div class="w-full" style={childListStyle}>
          {(props.item.items || []).map((child) => {
            return <MenuItem item={child} isClosed={props.isClosed} depth={props.depth + 1} />;
          })}
        </div>
      )}
    </div>
  );
};

const MenuSection: Component<{
  item: ISideMenuItem;
  isClosed: Signal<boolean>;
}> = (props) => {
  const { isClosed, item: sec } = props;

  const interp = useInterpolationSignal({
    duration: 0.25,
    initial: 1.0,
  });
  const expanded = signal<boolean>(true);
  const toggleExpanded = () => {
    expanded.set((x) => {
      return !x;
    });
  };

  watchSignal(expanded, (isExpanded) => {
    if (isExpanded) {
      interp.run({ to: 1.0, from: 0.0 });
    } else {
      interp.run({ to: 0.0, from: 1.0 });
    }
  });

  const style = computedSignal<CSSProperties>(() => {
    const f = interp.value.get();
    const sf = smoothstep(0.0, 1.0, f);
    const h = lerp(0, 2.7 * sec.items.length, sf);
    const opacity = lerp(0.0, 100, sf * sf * sf);

    return {
      height: opacity >= 99 ? "auto" : h + "rem",
      opacity: opacity + "%",
      ...(opacity < 50
        ? {
            pointerEvents: "none",
          }
        : {}),
    };
  });

  return (
    <div class="w-full">
      <SectionBanner
        item={sec}
        isClosed={isClosed}
        toggleExpanded={toggleExpanded}
      />
      <div class="w-full" style={style}>
        {(sec.items || []).map((it) => (
          <MenuItem item={it} isClosed={isClosed} depth={0} />
        ))}
      </div>
    </div>
  );
};

export const SideMenu: Component<ISideMenuProps> = (props) => {
  const isClosed = computedSignal(() => !props.hook.isOpen.get());

  return (
    <div
      class="h-full bg-amaranth-900 text-white select-none"
      style={props.hook.style}
    >
      {() => (
        <div class="w-full h-[2rem] flex items-center px-4 hover:text-amaranth-300">
          {() => (
            <div
              on={{
                click: () => props.hook.toggleOpen(),
              }}
              class={computedSignal(() =>
                isClosed.get()
                  ? "flex h-full items-center justify-center flex-1 cursor-pointer"
                  : "flex h-full items-center justify-end flex-1 cursor-pointer",
              )}
            >
              {() => (
                <Icon
                  icon={{
                    src: async () =>
                      import("../../assets/icons/chevron-left.svg"),
                    size: "1rem",
                    fill: "currentColor",
                    flipH: isClosed,
                  }}
                />
              )}
            </div>
          )}
        </div>
      )}
      {props.menu.items.map((sec) => (
        <MenuSection item={sec} isClosed={isClosed} />
      ))}
    </div>
  );
};
