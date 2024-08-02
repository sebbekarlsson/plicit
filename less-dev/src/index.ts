import './assets/css/index.css';

import { lnode, LNodeAttributes } from "../../less";
import { Button } from './components/button';
import { InputField } from './components/input-field';
import { ref } from "../../less";

const app = document.getElementById("app");


const Counter = () => {
  const count = ref<number>(0);
  return () =>
    lnode("div", {
      class: "border border-gray-300 rounded overflow-hidden p-2 space-y-4",
      children: [
        Button({
          key: "button",
          text: "Click Me",
          on: {
            click: () => {
              count.value = count.value + 1;
            },
          },
        }),
        () => {
          return lnode("p", {
            text: `The counter is ${count.value}`,
            deps: [count],
            key: "counter-value",
          });
        },
      ],
    });
};

const Form = () => {
  const name = ref<string>('A string');

  return () => lnode('div', {
    class: 'space-y-4 border border-gray-300 rounded overflow-hidden p-2',
    children: [
      InputField({ value: name.value, deps: [], on: { input: (ev) => {
        const target = ev.target as HTMLInputElement;
        name.value = target.value || '';
      } } }),
      () => lnode('div', { text: `You entered ${name.value}`, deps: [name] })
    ]
  }) 
}

const tree = lnode("div", {
  class: 'w-full h-full flex items-center justify-center',
  style: 'display: flex; justify-content: center; align-items: center;',
  children: [
    lnode('div', {
      class: 'w-[50vw] min-w-[480px] space-y-4',
      children: [
        Counter,
        Form
      ]
    })
  ],
});

tree.mountTo(app);
