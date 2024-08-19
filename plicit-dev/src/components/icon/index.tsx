import { Component, computedAsyncSignal, computedSignal, CSSProperties, isHTMLElement, isSVGElement, LNode, pget, signal } from "plicit";
import { IIconProps } from "./types";
import { isAsyncFunction } from "plicit/src/plicit/is";

export const Icon: Component<IIconProps> = (props) => {


  const element = signal<HTMLSpanElement | null>(null);

  const awaitedSource = computedAsyncSignal(async () => {
    if (isAsyncFunction(props.icon.src)) {
      const resp = await props.icon.src();
      if (!resp) return null;
      if (resp.default) return resp.default;
    }
    return props.icon.src;
  });


  const svgElement = signal<SVGSVGElement | SVGElement | null>(null); 

  computedSignal(() => {
    const svg = svgElement.get();
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
  });

  const handleLoaded = (node: LNode) => {
    const el = node.el;
    if (!el) return;
    if (isHTMLElement(el)) {
      element.set(el);
      const first = el.firstChild;
      if (isSVGElement(first)) {
        svgElement.set(first);
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
      computedSignal(() => <span onLoaded={handleLoaded} innerHTML={awaitedSource.data.get() || ''}/>)
    }
  </div>
} 
