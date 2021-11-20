import {initSimpleBar, ProgressBar, Token, Tokens} from '@nathanpb/progress'

export const myCustomToken: Token = bar => `This is the bar ${bar.title}`

export const eventsToken = (event: string): Token => bar =>
  `${bar.listenerCount(event)} listeners bound`

initSimpleBar({
  bar: new ProgressBar({ total: 100 }),
  template: '$barName$ $progress$% $events$',
  stream: process.stdout,
  tokens: {
    barName: myCustomToken,
    events: eventsToken('tick'),
    progress: Tokens.progress()
  },
})
