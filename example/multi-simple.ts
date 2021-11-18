/*
 * Copyright 2021 Nathan P. Bombana
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {Events, initMultiBar, ProgressBar, Tokens} from "../src";

const bar1 = new ProgressBar({ total: 100 })
const bar2 = new ProgressBar({ current: 50, total: 300 })
const bar3 = new ProgressBar({ total: 200 })

initMultiBar({
  bars: [bar1, bar2, bar3],
  template: '[$bar$] $progress$% | eta $eta$ s | elapsed $elapsed$ s',
  tokens: {
    bar: Tokens.bar({ length: 30 }),
    eta: Tokens.eta({ interval: 1000 }),
    elapsed: Tokens.elapsedTime({ interval: 1000 }),
    progress: Tokens.progress({ decimalDigits: 2 })
  },
  stream: process.stdout
})

bar1.on(Events.COMPLETED, () => console.log('Bar 1 completed'))
bar2.on(Events.COMPLETED, () => console.log('Bar 2 completed'))
bar3.on(Events.COMPLETED, () => console.log('Bar 3 completed'))

setInterval(() => bar1.tick(1), 500)
setInterval(() => bar2.tick(3), 100)
setInterval(() => bar3.tick(7), 200)
