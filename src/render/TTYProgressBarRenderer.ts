/*
 * Copyright 2021 Nathan P. Bombana
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {WriteStream} from "tty";
import {Token, TokenDict} from "../token";
import {ProgressBarState} from "../ProgressBar";
import {MultiProgressBarRenderer, ProgressBarRenderer} from "./ProgressBarRenderer";

export class TTYProgressBarRenderer extends ProgressBarRenderer {
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

export class TTYMultiProgressBarRenderer extends MultiProgressBarRenderer {
  constructor(
    template: string,
    tokens: { [token: string]: Token },
    bars: ProgressBarState[],
    public readonly stream: WriteStream,
  ) {
    super(template, tokens, bars);
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
