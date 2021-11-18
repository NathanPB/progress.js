import * as Token from '../src/token'
import ProgressBar from "../src/ProgressBar";

describe('token.ts', () => {
  describe('#bar', () => {
    it('Should have the length of 10', () => {
      const bar = new ProgressBar({ current: 0, total: 10 })
      expect(Token.bar({ length: 10 })(bar).length)
        .toBe(10)
    })

    it('Should be half filled with ~ and half with -', () => {
      const bar = new ProgressBar({ current: 5, total: 10 })
      expect(Token.bar({ length: 10, fill: '~', empty: '-' })(bar))
        .toBe('~~~~~-----')
    })

    it('Should be 70% filled', () => {
      const bar = new ProgressBar({ current: 7, total: 10 })
      expect(Token.bar({ length: 10 })(bar))
        .toBe('=======   ')
    })

    it('Should have a head', () => {
      const bar = new ProgressBar({ current: 5, total: 10 })
      expect(Token.bar({ length: 10, head: '>' })(bar))
        .toBe('====>     ')
    })
  })

  describe('#elapsedTime', () => {
    it('Should render to 0', () => {
      const bar = new ProgressBar()
      const now = Date.now();
      (bar as any).startTime = now

      expect(Token.elapsedTime({ until: () => now })(bar))
        .toEqual("0")
    })

    it('Should render to 1 (second)', () => {
      const bar = new ProgressBar()
      const now = Date.now();
      (bar as any).startTime = now - 1000

      expect(Token.elapsedTime({ until: () => now, interval: 1000 })(bar))
        .toEqual("1")
    })
  })

  describe('#progress', () => {
    describe('simple', () => {
      it('Should be 100 for 0/0 bar', () => {
        expect(Token.progress()(new ProgressBar()))
          .toBe("100")
      })

      it('Should be 50 for 5/10 bar', () => {
        expect(Token.progress()(new ProgressBar({ current: 5, total: 10 })))
          .toBe("50")
      })

      it('Should be 0 for 0/10 bar', () => {
        expect(Token.progress()(new ProgressBar({ current: 0, total: 10 })))
          .toBe("0")
      })
    })
  })

  describe('#current', () => {
    it('Should be 5', () => {
      expect(Token.current()(new ProgressBar({ current: 5 })))
        .toBe("5")
    })
  })

  describe('#total', () => {
    it('Should be 5', () => {
      expect(Token.total()(new ProgressBar({ total: 5 })))
        .toBe("5")
    })
  })

  describe('#rate', () => {
    const bar = new ProgressBar()
    bar.rate = () => 5000

    it('Should be 5000', () => {
      expect(Token.rate()(bar))
        .toBe("5000")
    })

    it('Should be 5', () => {
      expect(Token.rate({ interval: 1000 })(bar))
        .toBe("5")
    })
  })

  describe('#eta', () => {
    const bar = new ProgressBar()
    bar.eta = () => 5000

    it('Should be 5000', () => {
      expect(Token.eta()(bar))
        .toBe("5000")
    })

    it('Should be 5', () => {
      expect(Token.eta({ interval: 1000 })(bar))
        .toBe("5")
    })
  })
})
