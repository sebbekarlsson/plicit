# Plicit
A framework for building web user interfaces with explicitly defined reactivity

## Explicit Reactivity
While implicit reactivity is supported, this framework aims to provide full control over
the reactivity by giving you the ability to be explicit about it.

### Explicit Example
```tsx
const Counter = () => {
  const count = ref<number>(0);
  
  return (
    <div>
      <span>The counter is </span>
      {() => <span deps={[count]}>{count.value}</span>}
      <button on={{ click: () => count.value = count.value + 1 }}>increment</button>
    </div>
  )
}
```
> Here, we have explicitly defined that only one of the `<span>` elements should react to changes  
> by explicitly providing the dependencies (`deps`).

### Implicit Example
```tsx
const Counter = () => {
  const count = signal<number>(() => 0)
  
  return (
    <div>
      <span>The counter is </span>
      { computedSignal(() => <span>{count.get()}</span>) } 
      <button on={{ click: () => count.set(x => x + 1) }}>increment</button>
    </div>
  )
}
```
> Here, we are still explicitly saying the only one of the `<span>` elements should react to changes. 
> However, the dependencies are __automatically__ tracked.
