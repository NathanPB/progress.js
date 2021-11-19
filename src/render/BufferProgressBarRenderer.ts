/*
 * Copyright 2021 Nathan P. Bombana
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


import {TokenDict} from "../token";
import {ProgressBarState} from "../ProgressBar";
import {MultiProgressBarRenderer, ProgressBarRenderer} from "./ProgressBarRenderer";

/**
 * Used to render a {@link ProgressBarState} to a Buffer.
 *
 * Writes the string representation of the bar to the buffer, followed by a CR (`\r`) character.
 *
 * @category Bar Renderers
 * @see https://en.wikipedia.org/wiki/Carriage_return
 */
export class BufferProgressBarRenderer extends ProgressBarRenderer {
  constructor(
    template: string,
    tokens: TokenDict,
    public readonly buffer: Buffer,
  ) {
    super(template, tokens);
  }

  /**
   * Write the bar to the buffer, followed by CR.
   *
   * Example: `"[===>      ] 40%\r"`
   *
   * @param bar - The bar that should be written.
   */
  public render(bar: ProgressBarState) {
    this.buffer.write(this.makeString(bar) + '\r')
  }
}

/**
 * Used to render multiple {@link ProgressBarState}s to a Buffer.
 *
 * Writes the string representation of the bar to the buffer, separated by an EOL (`\n`) character.
 * The sequence of bars written are followed by a CR (`\r`) character.
 *
 * @category Bar Renderers
 * @see https://en.wikipedia.org/wiki/Newline
 * @see https://en.wikipedia.org/wiki/Carriage_return
 */
export class BufferMultiProgressBarRenderer extends MultiProgressBarRenderer {
  constructor(
    template: string,
    tokens: TokenDict,
    bars: ProgressBarState[],
    public readonly buffer: Buffer,
  ) {
    super(template, tokens, bars);
  }

  /**
   * Write the bars to the buffer, split by EOL and followed by CR.
   *
   * Example: `"[===>      ] 40%\n[====>     ] 50%\n[=>        ] 20%\r"`
   */
  public render() {
    this.buffer.write(
      this.bars
        .map(it => this.makeString(it))
        .join('\n') + '\r'
    )
  }
}
