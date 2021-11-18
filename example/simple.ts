// You probably want to import it from @nathanpb/progress
import {Events, initSimpleBar, ProgressBar, Tokens} from '../src'

const bar = new ProgressBar({ total: 100 })
initSimpleBar({
  bar,
  template: '[$bar$] $progress$% | eta $eta$ s | elapsed $elapsed$ s',
  stream: process.stdout,
  tokens: {
    bar: Tokens.bar({ length: 30 }),
    eta: Tokens.eta({ interval: 1000 }),
    elapsed: Tokens.elapsedTime({ interval: 1000 }),
    progress: Tokens.progress({ decimalDigits: 2 })
  },
})

bar.on(Events.COMPLETED, () => console.log('Bar completed'))

setInterval(() => bar.tick(1), 500)
