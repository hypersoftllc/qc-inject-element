# @qc/inject-element

A promise-based `Element` injection utility. Great for injecting `img`, `link`, and `script` elements.

The promise resolves successfully after the resource successfully loads. The promise rejects if an error occurs while loading or if the loading times out.


## Syntax

```typescript
type CssSelector = string;

type NodeLike = CssSelector | Node;

type AttachAction = 'after' | 'before' | 'endof' | 'startof';

type AttachableString = AttachAction + '@' + CssSelector;

interface AttachableObject {
  [AttachAction]: NodeLike;
}

type Attachable = AttachableString | AttachableObject;
```


## Examples

```js
import injectElement from 'inject-element'

injectElement({
  tag: 'script',
  src: 'https://cdn.example.com/foobar.js',
  attach: 'endof@body'
})
  .then((elmt) => {
    // Do what is needed now that the dependency successfully loaded.
  })
  .catch((err) => {
    console.error(err)
    // Maybe notify user that something went wrong and should try refreshing.
  })

injectElement({
  tag: 'link',
  href: 'https://cdn.example.com/foobar.css',
  type: 'stylesheet',
  attach: 'endof@head'
})
```
