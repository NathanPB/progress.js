import ProgressBar, {Events} from "../src/ProgressBar";

describe('ProgressBar', () => {
  describe('Event Emitter', () => {
    describe(Events.TICK, () => {
      it('Should be emitted once', () => {
        const bar = new ProgressBar({ total: 10 })
        const callback = jest.fn()
        bar.addListener(Events.TICK, callback)
        bar.tick(2)
        expect(callback).toBeCalledTimes(1)
      })

      it('Should be emitted 10 times', () => {
        const bar = new ProgressBar({ total: 10 })
        const callback = jest.fn()
        bar.addListener(Events.TICK, callback)

        for (let i=0; i<10; i++) bar.tick(2)
        expect(callback).toBeCalledTimes(10)
      })

      it('Callback should receive the arguments', () => {
        const bar = new ProgressBar({ total: 10 })
        const callback = jest.fn()
        bar.addListener(Events.TICK, callback)

        for (let i=1; i<=5; i++) bar.tick(i)
        expect(callback).toHaveBeenNthCalledWith(1, 1)
        expect(callback).toHaveBeenNthCalledWith(2, 2)
        expect(callback).toHaveBeenNthCalledWith(3, 3)
        expect(callback).toHaveBeenNthCalledWith(4, 4)
        expect(callback).toHaveBeenNthCalledWith(5, 5)
      })
    })

    describe(Events.COMPLETED, () => {
      it('Should be emitted once', () => {
        const bar = new ProgressBar({ total: 10 })
        const callback = jest.fn()
        bar.addListener(Events.COMPLETED, callback)
        bar.tick(10)
        expect(callback).toBeCalledTimes(1)
      })

      it('Should be emitted 2 times', () => {
        const bar = new ProgressBar({ total: 10 })
        const callback = jest.fn()
        bar.addListener(Events.COMPLETED, callback)

        for (let i=0; i<10; i++) bar.tick(2)
        bar.current = 0
        for (let i=0; i<10; i++) bar.tick(2)

        expect(callback).toBeCalledTimes(2)
      })
    })

    describe(Events.REACTIVATED, () => {
      it('Should not be emitted', () => {
        const bar = new ProgressBar({ total: 10 })
        const callback = jest.fn()
        bar.addListener(Events.REACTIVATED, callback)
        bar.tick(9)
        expect(callback).toBeCalledTimes(0)
      })

      it('Should be emitted once', () => {
        const bar = new ProgressBar({ current: 10, total: 10 })
        const callback = jest.fn()
        bar.addListener(Events.REACTIVATED, callback)
        bar.current = 5
        expect(callback).toBeCalledTimes(1)
      })

      it('Should be emitted twice', () => {
        const bar = new ProgressBar({ current: 10, total: 10 })
        const callback = jest.fn()
        bar.addListener(Events.REACTIVATED, callback)
        bar.current = 5
        bar.tick(5)
        bar.current = 0
        expect(callback).toBeCalledTimes(2)
      })
    })
  })

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

  describe('#title', () => {
    it('Should be empty', () => expect(new ProgressBar().title).toEqual(''))
    it('Should be foobar', () => {
      expect(new ProgressBar({ title: 'foobar' }).title).toEqual('foobar')
    })
    it('Should be changed after initialization foobar', () => {
      const bar = new ProgressBar()
      bar.title = 'foobar'
      expect(bar.title).toEqual('foobar')
    })
  })

  describe('#tick', () => {
    it('Should be 20', () => {
      const bar = new ProgressBar()
      for (let i=0; i<10; i++) bar.tick(2)
      expect(bar.current).toEqual(20)
    })
  })

  describe('#startTime', () => {
    it('Should be now (or close to now)', () => {
      const bar = new ProgressBar()
      const now = Date.now()
      expect(bar.startTime).toBeGreaterThanOrEqual(now - 1)
      expect(bar.startTime).toBeLessThanOrEqual(now + 1)
    })
  })

  describe('#elapsedTime', () => {
    it('Should be a second in the past', () => new Promise<void>((resolve) => {
      const bar = new ProgressBar()
      setTimeout(() => {
        const elapsedTime = bar.elapsedTime(Date.now())
        expect(elapsedTime).toBeGreaterThanOrEqual(1000 - 100)
        expect(elapsedTime).toBeLessThanOrEqual(1000 + 100)
        resolve()
      }, 1000)
    }))
  })

  describe('#rate', () => {
    it('Should be infinity when no time has passed yet', () => {
      const bar = new ProgressBar({ current: 10, total: 10 })
      bar.elapsedTime = () => 0
      expect(bar.rate()).toBe(Infinity)
    })

    it('Should be +- 20 ticks/ms', () => {
      const bar = new ProgressBar({ current: 0, total: 100_000 })
      const intervalId = setInterval(() => bar.tick(2000), 100)
      bar.on(Events.COMPLETED, () => clearInterval(intervalId))

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const rate = bar.rate()
          expect(rate).toBeGreaterThanOrEqual(20 - 5)
          expect(rate).toBeLessThanOrEqual(20 + 5)
          resolve()
        }, 1000)
      })
    })
  })

  describe('#progress', () => {
    it('Should be x', () => {
      expect(new ProgressBar({ current: 10 }).progress())
        .toBe(10)
    })
    it('Should be 1', () => expect(new ProgressBar().progress()).toBe(1))
    it('Should be .8', () => {
      expect(new ProgressBar({ current: 8, total: 10 }).progress())
        .toBe(.8)
    })
    it('Should be .5', () => {
      expect(new ProgressBar({ current: 5, total: 10 }).progress())
        .toBe(.5)
    })
    it('Should be .2', () => {
      expect(new ProgressBar({ current: 2, total: 10 }).progress())
        .toBe(.2)
    })
    it('Should be 0', () => {
      expect(new ProgressBar({ current: 0, total: 10 }).progress())
        .toBe(0)
    })
  })

  describe('#isComplete', () => {
    it('Should be true because the bar is 11/10', () => {
      expect(new ProgressBar({ current: 11, total: 10 }).isComplete())
        .toBe(true)
    })

    it('Should be true because the bar is 10/10', () => {
      expect(new ProgressBar({ current: 10, total: 10 }).isComplete())
        .toBe(true)
    })

    it('Should be false because the bar 09/10', () => {
      expect(new ProgressBar({ current: 9, total: 10 }).isComplete())
        .toBe(false)
    })

    it('Should be true because the bar is 0/0', () => {
      expect(new ProgressBar().isComplete())
        .toBe(true)
    })
  })

  describe('#eta', () => {
    it('Should be 0 because it\'s completed', () => {
      expect(new ProgressBar({ current: 10, total: 10 }).eta())
        .toBe(0)
    })

    it('Should be +- 10_000 ms', () => {
      const bar = new ProgressBar({ current: 0, total: 10_000 })
      const intervalId = setInterval(() => bar.tick(100), 100)
      bar.on(Events.COMPLETED, () => clearInterval(intervalId))

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const eta = bar.eta()
          expect(eta).toBeGreaterThanOrEqual(9_500)
          expect(eta).toBeLessThanOrEqual(10_500)
          resolve()
        }, 1000)
      })
    })
  })
})
