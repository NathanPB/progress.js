import {Events, initSimpleBar, ProgressBar, Tokens} from '@nathanpb/progress'

const messages = ['Stage Bondia', 'Help', 'Foo', 'Bar', 'Cool']
const bar = new ProgressBar({ total: 100 })
const token = Tokens.mutable('Initial')

initSimpleBar({
  bar,
  template: '[$bar$] $message$',
  stream: process.stdout,
  tokens: {
    bar: Tokens.bar({ length: 30 }),
    message: token
  },
})

bar.on(Events.COMPLETED, () => console.log('Bar completed'))

setInterval(() => bar.tick(1), 500)
setInterval(() => {
  token.setValue(messages[Math.floor(Math.random()*messages.length)])
}, 1500)
