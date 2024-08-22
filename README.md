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
> Here, the `<HelloWorld>` component will begin rendering once the `sleep()` promise has been resolved.

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


### Signals
As you might have noticed from the examples, signals are used for reactive states.  
**If you're not familiar with signals**: a signal is basically a container for some data and it will automatically track other functions (or signals) who depends on it.

#### Signals in Plicit
Signals in Plicit might differ a bit from other implementations, so let's go through some examples.  

##### Basic Counter
```typescript
const counter = signal(0);

// This will be triggered everytime the counter is changed.
effect(() => console.log(counter.get()))

counter.set((count) => count + 1)
```

##### Computed
There is also something called __computed signals__ in Plicit, it's just a signal that transforms the value of another signal.
```typescript
const name = signal<string>('John Doe');

// will update everytime `name` is changed
const reversedName = computedSignal(() => name.get().reverse());

// A computed signal can also be defined like this:
const reversedName = signal(() => name.get().reverse(), { isComputed: true });
```

##### Async
An async signal works just like a regular signal, however it's able to be updated asynchronously. 
```typescript
const products = asyncSignal<Product[]>(async () => {
  const response = await fetch('https://somedomain.com/your/api/endpoint');
  return await response.json();
});

// You can check whether or not the signal has finished, either by inspecting it's state,
// or by having another signal react to it's changes.
// However, inspecting it's state is not reactive.

// Reactive, will be triggered when the promise is resolved
const productNames = computedSignal(() => {
  return (products.get() || []).map(product => product.name)
})

// Not reactive
if (products.state === ESignalState.RESOLVED) { doSomething() }

```
You can also provide a fallback value and the signal will return this value if it hasn't been resolved yet
```typescript
const products = asyncSignal<Product[]>(async () => {
  const response = await fetch('https://somedomain.com/your/api/endpoint');
  return await response.json();
}, { fallback: [] });
```

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
