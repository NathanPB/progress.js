import {Events, ProgressBar, RenderTrigger, StreamMultiProgressBarRenderer, Tokens} from '../src';

const bar1 = new ProgressBar({ total: 100, title: 'Bar 1' })
const bar2 = new ProgressBar({ current: 50, total: 300, title: 'Bar Foo' })
const bar3 = new ProgressBar({ total: 200, title: 'Just bar' })

new StreamMultiProgressBarRenderer(
  '$title$ [$bar$] $progress$% | eta $eta$ s | elapsed $elapsed$ s', {
    bar: Tokens.bar({ length: 30 }),
    eta: Tokens.eta({ interval: 1000 }),
    elapsed: Tokens.elapsedTime({ interval: 1000 }),
    progress: Tokens.progress({ decimalDigits: 2 }),
    title: Tokens.title()
  },
  process.stdout,
  [bar1, bar2, bar3]
)
  .attach(self => new RenderTrigger(self, bar1, Events.TICK))
  .attach(self => new RenderTrigger(self, bar2, Events.TICK))
  .attach(self => new RenderTrigger(self, bar3, Events.TICK))

bar1.on(Events.COMPLETED, () => console.log('Bar 1 completed'))
bar2.on(Events.COMPLETED, () => console.log('Bar 2 completed'))
bar3.on(Events.COMPLETED, () => console.log('Bar 3 completed'))

setInterval(() => bar1.tick(1), 500)
setInterval(() => bar2.tick(3), 100)
setInterval(() => bar3.tick(7), 200)
