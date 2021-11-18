Simple highly customized CLI-like progress bar for Javascript

**If you get any questions or suggestions just open a [discussion](https://github.com/NathanPB/progress.js/discussions) or an [issue](https://github.com/NathanPB/progress.js/issues)**

## Installation

This package is published in [npmjs](https://www.npmjs.com/package/@nathanpb/progress):

``npm i @nathanpb/progress`` or ``yarn add @nathanpb/progress``

If you want to try the unstable features, use the ``next`` tag: ``npm i @nathanpb/progress@next``.


## Basic example

```ts
import { initSimpleBar } from '@nathanpb/progress'

initSimpleBar({ 
  bar: new ProgressBar({ total: 100 }),
  template: '[$bar$] $progress$% | eta $eta$ s | elapsed $elapsed$ s',
  stream: process.stdout,
  tokens: {
    bar: Tokens.bar({ length: 30 }),
    eta: Tokens.eta({ interval: 1000 }),
    elapsed: Tokens.elapsedTime({ interval: 1000 }),
    progress: Tokens.progress({ decimalDigits: 2 })
  }
})
```
![](https://i.imgur.com/m8u1gFX.gif)

The above code is a shortcut to the full version. If you want to take control over the customization, check the snipped bellow:

<details>
  <summary>Complete version</summary>

The process is to:
1. Create the bar
2. Create the renderer
3. Create a render trigger listening to the ``'tick'`` event
4. Attach the render trigger to the render
5. Listen to the ``'completed'`` event and print something

```ts
import {ProgressBar, StreamProgressBarRenderer, RenderTrigger, Events, Tokens} from '@nathanpb/progress'

const bar = new ProgressBar({ total: 100 })

new StreamProgressBarRenderer(
'[$bar$] $progress$% | eta $eta$ s | elapsed $elapsed$ s', {
bar: Tokens.bar({ length: 30 }),
eta: Tokens.eta({ interval: 1000 }),
elapsed: Tokens.elapsedTime({ interval: 1000 }),
progress: Tokens.progress({ decimalDigits: 2 })
},
process.stdout,
).attach(self => new RenderTrigger(self, bar, Events.TICK))

bar.on(Events.COMPLETED, () => console.log('Bar completed'))

setInterval(() => bar.tick(1), 500)
```

</details>

## Downsides

Compared to other similar libraries (special thanks to [node-progress](https://github.com/visionmedia/node-progress) which was my inspiration), this lib is a bit **overcomplicated**. So if you want something dead simple, their solution might suit better for your use case.


## License

```
Copyright 2021 Nathan P. Bombana

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

Do whatever you want with my code just don't make it boring
