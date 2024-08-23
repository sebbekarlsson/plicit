import {
  Component,
  computedSignal,
  LNode,
  LNodeRef,
  Signal,
  signal,
  unwrapElement,
  useMousePosition,
  watchSignal,
} from "plicit";
import { Grid } from "../../components/grid";
import { range, VEC2, Vector } from "tsmathutil";

const Thing: Component = (props) => {
  return (
    <div
      ref={props.ref}
      on={props.on}
      style={props.style}
      draggable
      class="bg-primary-500 rounded-lg shadow-lg hover:shadow-2xl cursor-grab min-w-[2rem] max-w-[10rem] min-h-[1rem] p-4 flex items-center justify-center"
    >
      {props.children}
    </div>
  );
};

type UseDragAndDropProps = {
  dropAreas: Array<LNodeRef>;
  items: Array<LNodeRef>;
};

type DragState = {
  dragging: boolean;
  position: Vector;
  clickPos: Vector;
  rect: DOMRect | null;
  item: LNodeRef;
};

const useDragAndDrop = (props: UseDragAndDropProps) => {
  const mouse = useMousePosition();
  const states = props.items.map(
    (it): Signal<DragState> =>
      signal({
        dragging: false,
        position: VEC2(0, 0),
        clickPos: VEC2(0, 0),
        item: it,
        rect: null,
      }),
  );

  watchSignal(mouse.pos, (p) => {
    for (const state of states) {
      state.set((s) => ({ ...s, position: p.sub(s.clickPos) }));
    }
  });

  const dropTo = (a: LNode, b: LNode) => {
    a.teleport(b);
  };

  for (let i = 0; i < props.items.length; i++) {
    const item = props.items[i];
    watchSignal(item, (node) => {
      const nodeEl = unwrapElement(node);
      if (!nodeEl) return;
      const onDragStart = (event: DragEvent) => {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        const p = mouse.pos.get().sub(VEC2(rect.x, rect.y));
        states[i].set((s) => ({ ...s, dragging: true, clickPos: p, rect }));
        event.dataTransfer!.setData("text/plain", i + "");
        event.dataTransfer!.effectAllowed = "move";
        const img = new Image();
        img.src = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";
        event.dataTransfer!.setDragImage(img, 0, 0);
      };
      nodeEl.removeEventListener("dragstart", onDragStart);
      nodeEl.addEventListener("dragstart", onDragStart);
    });
  }

  for (const area of props.dropAreas) {
    watchSignal(area, (area) => {
      const dropEl = unwrapElement(area);
      if (!dropEl) return;

      const onDragOver = (event: DragEvent) => {
        event.preventDefault();
        event.dataTransfer!.dropEffect = "move";
      };

      const onDrop = (event: DragEvent) => {
        event.preventDefault();
        const id = event.dataTransfer!.getData("text/plain");
        const index = Number(id);
        const node = props.items[index];
        if (!node) return;
        const dragstate = states[index];
        if (!dragstate) return;
        dragstate.set((s) => ({ ...s, dragging: false }));

        dropTo(node.get(), area);
      };

      dropEl.removeEventListener("dragover", onDragOver);
      dropEl.removeEventListener("drop", onDrop);

      dropEl.addEventListener("dragover", onDragOver);
      dropEl.addEventListener("drop", onDrop);
    });
  }

  return { states, mousePos: mouse.pos };
};

export default () => {
  const dropArea1: LNodeRef = signal(undefined);
  const dropArea2: LNodeRef = signal(undefined);

  const things = range(6).map((): LNodeRef => signal(undefined));

  const dd = useDragAndDrop({
    dropAreas: [dropArea1, dropArea2],
    items: things,
  });

  return (
    <div class="w-full h-full p-4">
      <Grid columns="1fr 1fr" gap="1rem" class="w-full h-full">
        <div
          ref={dropArea1}
          class="bg-gray-300 border border-dashed border-gray-500 p-4 space-y-4"
        >
          {things.map((it, i) => {
            return <Thing ref={it}>{i}</Thing>;
          })}
        </div>
        <div
          ref={dropArea2}
          class="bg-gray-300 border border-dashed border-gray-500 p-4 space-y-4"
        ></div>
      </Grid>
      <div>
        {dd.states.map((it, i) => {
          return (
            <Thing
              style={computedSignal(() => {
                const s = it.get();
                const rect = s.rect;
                return {
                  ...(rect
                    ? {
                        width: rect.width + "px",
                        height: rect.height + "px",
                      }
                    : {}),
                  position: "fixed",
                  left: s.position.x + "px",
                  top: s.position.y + "px",
                  pointerEvents: "none",
                  ...(s.dragging
                    ? {}
                    : {
                        display: "none",
                      }),
                };
              })}
            >
              {i}
            </Thing>
          );
        })}
      </div>
    </div>
  );
};
