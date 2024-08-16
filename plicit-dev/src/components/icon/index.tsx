import { Component, computed, computedAsync, computedSignal, CSSProperties, isHTMLElement, isSVGElement, LNode, pget, ref, signal } from "plicit";
import { IIconProps } from "./types";
import { isAsyncFunction } from "plicit/src/plicit/is";

export const Icon: Component<IIconProps> = (props) => {


  const element = ref<HTMLSpanElement | null>(null);

  const awaitedSource = computedAsync(async () => {
    if (isAsyncFunction(props.icon.src)) {
      const resp = await props.icon.src();
      if (!resp) return null;
      if (resp.default) return resp.default;
    }
    return props.icon.src;
  }, [props.icon], { deep: false });


  const svgElement = ref<SVGSVGElement | null>(null); 

  computed(() => {
    const svg = svgElement.value;
    if (!svg) return;

    if (props.icon.size) {
      svg.setAttribute('width', props.icon.size);
      svg.setAttribute('height', props.icon.size);
    }

    if (props.icon.color) {
      svg.setAttribute('color', props.icon.color);
    }

    const paths = svg.querySelectorAll('path');
    if (props.icon.fill) {
      paths.forEach((path) => {
        if (path.hasAttribute('fill')) {
          path.setAttribute('fill', props.icon.fill);
        }
      })
    }
    if (props.icon.stroke) {
      paths.forEach((path) => {
        if (path.hasAttribute('stroke')) {
          path.setAttribute('stroke', props.icon.stroke);
        }
      })
    }
  }, [svgElement]);

  const handleLoaded = (node: LNode) => {
    const el = node.el;
    if (!el) return;
    if (isHTMLElement(el)) {
      element.value = el;
      const first = el.firstChild;
      if (isSVGElement(first)) {
        svgElement.value = first;
      }
    }
  }

  const style = computedSignal((): CSSProperties => {
    const flipH = pget(props.icon.flipH);
    return {
      pointerEvents: 'none',
      ...(flipH ? {
        transform: 'scale(-1, 1)'
      } : {})
    }
  })

  return <div class={props.class} style={style}>
    {
      () => <span onLoaded={handleLoaded} deps={[awaitedSource.data]} innerHTML={awaitedSource.data.value || ''}/>
    }
  </div>
} 
