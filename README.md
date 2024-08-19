# Plicit
A framework for building web user interfaces with explicitly defined reactivity

## Getting Started
First, install:
```bash
npm install plicit
```

Make sure your `tsconfig.json` has the following:
```json
{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "jsx": "react",
    "jsxFactory": "ljsx",
    ...
  }
  ...
}
```

Then create an `index.tsx` with the following content:
```tsx
import { ljsx, Component, setup } from "plicit";

globalThis.ljsx = ljsx;

const App: Component = () => {
  return (
    <div>
      Hello world!
    </div>
  );
};

// Mount the app to an element defined in your index.html 
setup(App, document.getElementById("app"));
```
> For more information, take a look at this [sample project](./plicit-dev) which is using webpack.

## Explicit Reactivity
While some implicit reactivity is supported, this framework aims to provide full control over
the reactivity by giving you the ability to be explicit about it.


### Explicit Example
```tsx
const Counter = () => {
  const count = signal<number>(0)
  
  return (
    <div>
      <span>The counter is </span>
      { computedSignal(() => <span>{count.get()}</span>) } 
      <button on={{ click: () => count.set(x => x + 1) }}>increment</button>
    </div>
  )
}
```
> Here, we are explicitly saying the only one of the `<span>` elements should react to changes. 
> However, the dependencies are __automatically__ tracked.

---

To summarize, we explicitly define an element to be reactive by wrapping it in a function.  
Dependencies of a `signal` are automatically tracked.
