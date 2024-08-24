import "./assets/css/index.css";
import { computedSignal, EVNodeType, mountComponent, mountVNode, signal, vnode, VNode } from "plicit"
import { Button } from "./components/button";
import { RangeSlider } from "./components/range-slider";

const App = () => {

  return <div class="w-full h-full p-16">
    <RangeSlider value={0}/>
  </div>; 
 // const counter = signal<number>(0);


 // return <div class="w-full h-full p-4">
 //   <div class="grid grid-cols-[max-content,max-content] gap-2 items-center">
 //     <Button on={{ click: () => counter.set(x => x + 1) }}>Increase</Button>
 //     {counter}
 //   </div>
 // </div>;
  
  //return vnode('div', {
  //  style: {
  //    background: 'red'
  //  },
  //  children: [
  //    vnode('button', { text: 'Increase', on: { click: ()  => counter.set(x => x + 1) } }),
  //    vnode('span', { text: counter })
  //  ]
  //});
};
mountComponent(App, document.getElementById('app'));
//mountVNode(App(), document.getElementById('app'));
