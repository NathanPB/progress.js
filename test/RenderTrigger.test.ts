import {Events, ProgressBar, RenderTrigger} from "../src";

describe('RenderTrigger', () => {
  it('Should not trigger the render function because the trigger is not active', () => {
    const renderer = { render: jest.fn() } as any
    const bar = new ProgressBar({ total: 10 })

    new RenderTrigger(renderer, bar)
    for (let i=0; i<5; i++) bar.emit(Events.TICK)

    expect(renderer.render).toHaveBeenCalledTimes(0)
  })

  it('Should init the trigger and call the render function 5 times', () => {
    const renderer = { render: jest.fn() } as any
    const bar = new ProgressBar({ total: 10 })

    const trigger = new RenderTrigger(renderer, bar)

    trigger.init()
    for (let i=0; i<5; i++) bar.emit(Events.TICK)

    expect(renderer.render).toHaveBeenCalledTimes(5)
  })

  it('Should trigger, call the render function 5 times, then disable it', () => {
    const renderer = { render: jest.fn() } as any
    const bar = new ProgressBar({ total: 10 })

    const trigger = new RenderTrigger(renderer, bar)

    trigger.init()
    for (let i=0; i<5; i++) bar.emit(Events.TICK)

    trigger.finalize()
    for (let i=0; i<5; i++) bar.emit(Events.TICK)

    expect(renderer.render).toHaveBeenCalledTimes(5)
  })

})
