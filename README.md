<div align="center" style="text-align: center;">
    <img width="150" src="logo.png"/>
    <h1>Plicit</h1>
    <i>A framework for building web user interfaces with explicitly defined reactivity</i>
</div>

--- 

#### Some unique features:
 * You have full control over the reactivity.  
   > You decide if a singe property / attribute should be reactive, or if an entire component should be reactive.
 * Reactivity is separated from the rendering.  
   > You can use reactivity "outside" of the component hierarchy.
 * Asynchronous components and synchronous components are treated the same.  
   > You don't need to treat async components in some special way... ( No **\<Suspense\>** needed! )

---

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

## Reactivity

### Explicit Reactivity
While some implicit reactivity is supported, this framework aims to provide full control over
the reactivity by giving you the ability to be explicit about it.


An example:
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


### Asynchronous Reactivity
Plicit has been developed with asynchronicity in mind.  
Components can be async, as well as VDOM children.

#### Async Components
```tsx
const HelloWorld = async () => {
  await sleep(1000); // or do an API request or something :)
  return <div>Hello world!</div>;
}

const App = () => {
  return <div>
    <HelloWorld/>
  </div>
}
```
> Here, the `<HelloWorld>` component with begin rendering once the `sleep()` promise has been resolved.

You can also define a "placeholder" to render while the component is loading:
```tsx
const App = () => {
  return <div>
    <HelloWorld asyncFallback={() => <span>Please wait...</span>}/>
  </div>
}
```
> Here's a good place to put a spinner or some other cool animation!

#### Async VDOM children
```tsx
const App = () => {
  return <div>
    {
      asyncSignal(async () => {
        await sleep(1000);
        return <div>Hello world!</div>
      }, { fallback: () => <span>Please wait...</span> })
    }
  </div>
}
```
> This will give you a similar result as the previous example,  
> but instead of an async component, we're using an async signal.
