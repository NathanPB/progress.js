# What's going on here?

The functions [initSimpleBar](/api/modules.html#initSimpleBar) and [initMultiBar](/api/modules.html#initMultiBar) are a simplified way to create a progress bar when you don't need much, but under the hood all this process is happening:

1. Create a [TTYProgressBarRenderer](#progressbarrenderer)
2. Create a [RenderTrigger](#rendertrigger) linked to the [tick event](/api/enums/Events.html#tick)
3. Attach the [RenderTrigger](#rendertrigger) to the bar

# What are these components doing?

## ProgressBar

The ProgressBar is the bar itself, the object that is used to store the state (progress, total, title) and emit basic events.

```typescript
import {ProgressBar} from "@nathanpb/progress"

const bar = new ProgressBar({ current: 50, total: 100, title: 'Beautiful progress bar' })
```

The bar itself does not have any representation string, it's just a component to store state and emit events.

**References:**
[ProgressBar](/api/classes/ProgressBar.html)

## ProgressBarRenderer

The ProgressBarRenderer (or just Renderer, call whatever you want) is what is used to transform a ProgressBar object into a visual representation.

```typescript
import {ProgressBarRenderer, TTYProgressBarRenderer} from "@nathanpb/progress";

const template = '[$bar$] $progress$% | eta $eta$ s | elapsed $elapsed$ s'
const tokens = {
  bar: Tokens.bar({ length: 30 }),
  eta: Tokens.eta({ interval: 1000 }),
  elapsed: Tokens.elapsedTime({ interval: 1000 }),
  progress: Tokens.progress({ decimalDigits: 2 })
}
const stream = process.stdout

const renderer = new TTYProgressBarRenderer(template, tokens, stream)
```

The list of existing renderers can be found [here](renderers.md).

**References:**
[ProgressBarRenderer](/api/classes/ProgressBarRenderer.html)

### Template

The Template is a string that marks where the [Tokens](#tokens) should be rendered in.

You can render [Tokens](#tokens) by wrapping the token key with `$`.

E.g: ``'$title$ [$bar$] $progress$%'``: ``"Beautiful Progress Bar [=====     ]" 50%``

## Tokens

Tokens are used to transform the state of the [ProgressBar](#progressbar) into a human-readable string.

E.g:

```typescript
import {Tokens} from '@nathanpb/progress';

const progressToken = Tokens.progress({ decimalDigits: 2, padDigits: 3 })
const barToken = Tokens.bar({ length: 10, fill: '=', head: '>', empty: '-' })

console.log(progressToken(bar)) // 050.00
console.log(barToken(bar))      // ====>-----
```

The list of existing renderers can be found [here](tokens.md).

**References:**
[Token](/api/classes/Token.html)
[Tokens](/api/modules/Tokens.html)

### TokenDict

The TokenDict is just a representation of a map of <string, Token>.

```typescript
const dict = {
  progress: progressToken,
  bondia: barToken
}
```

The [ProgressBarRenderers](#progressbarrenderer) will (usually) use the keys to parse the template


```typescript
import {BufferProgressBarRenderer} from "@nathanpb/progress";

const buffer = Buffer.alloc(16)
const template = '$bondia$ $progress$'
const renderer = new BufferProgressBarRenderer(template, dict, buffer)
renderer.render(bar)

console.log(buffer.toString('utf-8')) // "====>----- 050.00\r"
```

**References:**
[TokenDict](/api/modules/Tokens.html#TokenDict)
[BufferProgressBarRenderer](/api/classes/BufferProgressBarRenderer.html)

## RenderTrigger

The [ProgressBarRenderer](#progressbarrenderer) do not automatically write the bars. To make they work, we need to call the [render](/api/classes/ProgressBarRenderer.html#render) function.

To make call it whenever the bar changes, we use a RenderTrigger bound to a certain [ProgressBar](#progressbar) event and a [Renderer](#progressbarrenderer)

```typescript
import {RenderTrigger, Events} from "@nathanpb/progress";

const trigger = new RenderTrigger(renderer, bar, Events.TICK)
renderer.attach(() => trigger)
```

The above fragment will make the [renderer](#progressbarrenderer) render the bar every ``tick`` event.

You can also do the above fragment like this, which is particularly useful when you don't need to store the ``renderer`` instance.

```typescript
import {RenderTrigger, Events} from "@nathanpb/progress";

new BufferProgressBarRenderer(template, dict, buffer)
  .attach(self => new RenderTrigger(self, bar, Events.TICK))
```

And you can also bind the Renderer to [every possible event](/api/enums/Events.html).

**References:**
[RenderTrigger](/api/classes/RenderTrigger.html)
[Events](/api/enums/Events.html)
[BufferProgressBarRenderer](/api/classes/BufferProgressBarRenderer.html)
