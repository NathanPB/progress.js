/*
 * Copyright 2021 Nathan P. Bombana
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


import ProgressBar from "../src/ProgressBar";

describe('ProgressBar', () => {
  describe('#current', () => {
    it('Should start on 0', () => expect(new ProgressBar().current).toEqual(0))
    it('Should start on 5', () => expect(new ProgressBar({ current: 5 }).current).toEqual(5))
    it('Should start on 0 and then be changed to 5', () => {
      const bar = new ProgressBar()
      expect(bar.current).toEqual(0)

      bar.current = 5
      expect(bar.current).toEqual(5)
    })
    it('Should start on 0 when a negative value is given at startup', () => {
      expect(new ProgressBar({ current: -5 }).current).toEqual(0)
    })
    it('Should start on 0 when a negative value is set', () => {
      const bar = new ProgressBar()
      bar.current = -5
      expect(bar.current).toEqual(0)
    })
  })
  
  describe('#total', () => {
    it('Should start on 0', () => expect(new ProgressBar().total).toEqual(0))
    it('Should start on 5', () => expect(new ProgressBar({ total: 5 }).total).toEqual(5))
    it('Should start on 0 and then be changed to 5', () => {
      const bar = new ProgressBar()
      expect(bar.total).toEqual(0)

      bar.total = 5
      expect(bar.total).toEqual(5)
    })
    it('Should start on 0 when a negative value is given at startup', () => {
      expect(new ProgressBar({ total: -5 }).total).toEqual(0)
    })
    it('Should start on 0 when a negative value is set', () => {
      const bar = new ProgressBar()
      bar.total = -5
      expect(bar.total).toEqual(0)
    })
  })
})
