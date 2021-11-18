/*
 * Copyright 2021 Nathan P. Bombana
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {ProgressBarState} from "../ProgressBar";
import {Token, TokenDict} from "../token"
import {WriteStream} from "tty";
import RenderTrigger from "./RenderTrigger";

export abstract class ProgressBarRenderer {
  private readonly _triggers: RenderTrigger[] = []
  public get triggers() { return Object.freeze(Array.of(...this._triggers)) }

  protected constructor(
    public readonly template: string,
    public readonly tokens: TokenDict
  ) {}

  public abstract render(bar: ProgressBarState): void

  public makeString(bar: ProgressBarState): string {
    return Object.entries(this.tokens)
      .reduce(
        (str, [key, token]) => str
          .split(`$${key}$`)
          .join(token(bar)), // thanks dude @oliver-m-grech https://stackoverflow.com/a/68982424/9893963
        this.template
      )
  }

  public attach(attacher: (self: ProgressBarRenderer)=>RenderTrigger): ProgressBarRenderer {
    const trigger = attacher(this)
    this._triggers.push(trigger)
    trigger.init()
    return this
  }

  public detach(rendererTrigger: RenderTrigger): void {
    const index = this.triggers.indexOf(rendererTrigger)
    if (index === -1) throw new Error('RenderTrigger not found')
    this._triggers.splice(index, 1).forEach(it => it.finalize())
  }
}

export class StreamProgressBarRenderer extends ProgressBarRenderer {
  constructor(
    template: string,
    tokens: TokenDict,
    public readonly stream: WriteStream,
  ) {
    super(template, tokens);
  }

  public render(bar: ProgressBarState) {
    if (!this.stream.isTTY) return
    this.stream.cursorTo(0)
    this.stream.write(this.makeString(bar))
    this.stream.clearLine(1)
  }
}

export class StreamMultiProgressBarRenderer extends ProgressBarRenderer {
  constructor(
    template: string,
    tokens: { [token: string]: Token },
    public readonly stream: WriteStream,
    private readonly bars: ProgressBarState[],
  ) {
    super(template, tokens);
  }

  public indexOfBar(bar: ProgressBarState): number {
    return this.bars.indexOf(bar)
  }

  public render(bar: ProgressBarState) {
    if (!this.stream.isTTY) return
    const index = this.indexOfBar(bar)
    if (index === -1) return

    this.stream.cursorTo(0, index)
    this.stream.write(this.makeString(bar))
    this.stream.clearLine(1)
  }
}
