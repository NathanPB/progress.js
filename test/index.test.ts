/*
 * Copyright 2021 Nathan P. Bombana
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {Events, initMultiBar, initSimpleBar, ProgressBar, Tokens, TTYProgressBarRenderer} from "../src";

describe('index', () => {
  describe('#initSimpleBar', () => {
    const bar = new ProgressBar()
    const template = 'foobar'
    const tokens = { bondia: Tokens.title() }
    const render = initSimpleBar({ bar, template, tokens, stream: process.stdout })

    it(
      'Should have specified template',
      () => expect(render.template).toEqual(template)
    )

    it(
      'Should have the specified token dict',
      () => expect(render.tokens).toStrictEqual(tokens)
    )

    it(
      'Should have one trigger',
      () => expect(render.triggers.length).toEqual(1)
    )

    it(
      'The bar should be the specified one',
      () => expect(render.triggers[0].bar).toEqual(bar)
    )

    it(
      'The first trigger must listen to the \'tick\' event',
      () => expect(render.triggers[0].event).toEqual(Events.TICK)
    )

    it(
      'Should be linked to stdout',
      () => expect((render as TTYProgressBarRenderer).stream).toEqual(process.stdout)
    )
  })

  describe('#initMultiBar', () => {
    const bars = [new ProgressBar(), new ProgressBar()]
    const template = 'foobar'
    const tokens = { bondia: Tokens.title() }
    const render = initMultiBar({ bars, template, tokens, stream: process.stdout})

    it(
      'Should have specified template',
      () => expect(render.template).toEqual(template)
    )

    it(
      'Should have the specified token dict',
      () => expect(render.tokens).toStrictEqual(tokens)
    )

    it(
      'Should have two triggers',
      () => expect(render.triggers.length).toEqual(2)
    )

    it(
      'The bars should be the specified ones',
      () => {
        expect(render.triggers[0].bar).toEqual(bars[0])
        expect(render.triggers[1].bar).toEqual(bars[1])
      }
    )

    it(
      'The first triggers must listen to the \'tick\' event',
      () => {
        expect(render.triggers[0].event).toEqual(Events.TICK)
        expect(render.triggers[1].event).toEqual(Events.TICK)
      }
    )

    it(
      'Should be linked to stdout',
      () => expect((render as TTYProgressBarRenderer).stream).toEqual(process.stdout)
    )
  });
})
