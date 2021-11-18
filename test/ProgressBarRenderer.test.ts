import {
  ProgressBar,
  ProgressBarRenderer,
  ProgressBarState,
  RenderTrigger,
  StreamMultiProgressBarRenderer,
  StreamProgressBarRenderer,
  Tokens
} from "../src";
import {TokenDict} from "../src/token";
import {WriteStream} from 'tty';
import Mock = jest.Mock;

class MockedRenderer extends ProgressBarRenderer {

  constructor(template: string, tokens: TokenDict, public readonly callback: Mock) {
    super(template, tokens);
  }

  render(bar: ProgressBarState): void {
    this.callback(bar)
  }

}

const bar1 = new ProgressBar({ current: 50, total: 100 })
const bar2 = new ProgressBar({ current: 25, total: 100 })
const bar3 = new ProgressBar({ current: 75, total: 150 })
const template = '$current$ $current$ $total$'
const tokens = { current: Tokens.current(), total: Tokens.total() }

describe('ProgressBarRenderer', () => {
  describe('#triggers', () => {
    it('Should start empty', () => {
      const render = new MockedRenderer(template, tokens, jest.fn())
      expect(render.triggers.length).toEqual(0)
    })

    it('Should be immutable', () => {
      const render = new MockedRenderer(template, tokens, jest.fn())
      expect(jest.fn(() => (render.triggers as any).push(render)))
        .toThrow()
    })
  })

  describe('#attach', () => {
    it('Should attach two triggers', () => {
      const render = new MockedRenderer(template, tokens, jest.fn())
      const triggerA = new RenderTrigger(render, bar1)
      const triggerB = new RenderTrigger(render, bar1)
      triggerA.init = jest.fn()
      triggerB.init = jest.fn()

      render
        .attach(() => triggerA)
        .attach(() => triggerB)

      expect(render.triggers.length).toEqual(2)
      expect(render.triggers[0]).toEqual(triggerA)
      expect(render.triggers[1]).toEqual(triggerB)
    })
  })

  describe('#detach', () => {
    it('Should detach the second trigger', () => {
      const render = new MockedRenderer(template, tokens, jest.fn())
      const triggerA = new RenderTrigger(render, bar1)
      const triggerB = new RenderTrigger(render, bar1)
      const triggerC = new RenderTrigger(render, bar1)
      triggerA.init = jest.fn()
      triggerB.init = jest.fn()
      triggerC.init = jest.fn()

      render
        .attach(() => triggerA)
        .attach(() => triggerB)
        .attach(() => triggerC)

      render.detach(triggerB)

      expect(render.triggers.length).toEqual(2)
      expect(render.triggers[0]).toEqual(triggerA)
      expect(render.triggers[1]).toEqual(triggerC)
    })

    it('Should fail because this trigger is not present', () => {
      const render = new MockedRenderer(template, tokens, jest.fn())
      const triggerA = new RenderTrigger(render, bar1)
      const triggerB = new RenderTrigger(render, bar1)

      render
        .attach(() => triggerA)

      expect(jest.fn(() => render.detach(triggerB)))
        .toThrow()
    })
  })

  describe('#makeString', () => {
    it('Should render all the tokens to the bar string', () => {
      const render = new MockedRenderer(template, tokens, jest.fn())
      expect(render.makeString(bar1))
        .toEqual("50 50 100")
    })

    it('Should left the unknown token $bondia$', () => {
      const render = new MockedRenderer('$current$ $current$ $total$ $bondia$', tokens, jest.fn())
      expect(render.makeString(bar1))
        .toEqual("50 50 100 $bondia$")
    })
  })
})

describe('StreamProgressBarRenderer', () => {
  describe('#render', () => {
    it('Should do nothing if it\s not tty', () => {
      const stream: WriteStream = { ...process.stdout, write: jest.fn(), isTTY: false } as any
      const renderer = new StreamProgressBarRenderer(template, tokens, stream)
      renderer.render(bar1)

      expect(stream.write)
        .toHaveBeenCalledTimes(0)
    })

    it('Should write the bar the tty', () => {
      const stream: WriteStream = { cursorTo: jest.fn(), clearLine: jest.fn(), write: jest.fn(), isTTY: true } as any
      const renderer = new StreamProgressBarRenderer(template, tokens, stream)

      renderer.render(bar1)
      expect(stream.write).toHaveBeenCalledTimes(1)
      expect(stream.write).toHaveBeenCalledWith("50 50 100")
    })
  });
});

describe('StreamMultiProgressBarRenderer', () => {
  describe('#indexOfBar', () => {
    const renderer = new StreamMultiProgressBarRenderer(template, tokens, process.stdout, [bar1, bar2])
    it('bar1 should be in the first index', () => {
      expect(renderer.indexOfBar(bar1)).toEqual(0)
    })

    it('bar2 should be in the second index', () => {
      expect(renderer.indexOfBar(bar2)).toEqual(1)
    })

    it('bar3 should not be in the indexes', () => {
      expect(renderer.indexOfBar(bar3)).toEqual(-1)
    })
  });

  describe('#render', () => {
    it('Should do nothing if it\s not tty', () => {
      const stream: WriteStream = { ...process.stdout, write: jest.fn(), isTTY: false } as any
      const renderer = new StreamMultiProgressBarRenderer(template, tokens, stream, [bar1, bar2])
      renderer.render(bar1)

      expect(stream.write)
        .toHaveBeenCalledTimes(0)
    })

    it('Should do nothing because the bar is not in the indexes', () => {
      const stream: WriteStream = { ...process.stdout, write: jest.fn(), isTTY: true } as any
      const renderer = new StreamMultiProgressBarRenderer(template, tokens, stream, [bar1, bar2])
      renderer.render(bar3)

      expect(stream.write)
        .toHaveBeenCalledTimes(0)
    })

    it('Should write the first bar the tty', () => {
      const stream: WriteStream = { cursorTo: jest.fn(), clearLine: jest.fn(), write: jest.fn(), isTTY: true } as any
      const renderer = new StreamMultiProgressBarRenderer(template, tokens, stream, [bar1, bar2])

      renderer.render(bar1)
      expect(stream.write).toHaveBeenCalledTimes(1)
      expect(stream.write).toHaveBeenCalledWith("50 50 100")
    })

    it('Should write the second bar the tty', () => {
      const stream: WriteStream = { cursorTo: jest.fn(), clearLine: jest.fn(), write: jest.fn(), isTTY: true } as any
      const renderer = new StreamMultiProgressBarRenderer(template, tokens, stream, [bar1, bar2])

      renderer.render(bar2)
      expect(stream.write).toHaveBeenCalledTimes(1)
      expect(stream.write).toHaveBeenCalledWith("25 25 100")
    })
  });
});
