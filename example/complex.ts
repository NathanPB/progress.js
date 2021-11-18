import {Events, ProgressBar, RenderTrigger, StreamProgressBarRenderer, Tokens} from '../src'

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
