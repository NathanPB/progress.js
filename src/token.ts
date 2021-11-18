/*
 * Copyright 2021 Nathan P. Bombana
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {ProgressBarState} from "./ProgressBar";
import {formatNumber, NumberFormat} from "./utils";

export type Token = (bar: ProgressBarState)=>string

export const bar = (
  { length, fill = '=', head = fill, empty = ' '}:
  { length: number, fill?: string, empty?: string, head?: string }
):Token => bar => {
  const fillLength = Math.round(length * bar.progress())
  return new Array(length)
    .fill(1)
    .map((_, idx) => {
      if (idx < fillLength-1) {
        return fill
      } else if (idx === fillLength-1) {
        return head
      } else {
        return empty
      }
    })
    .join("")
}

export const elapsedTime = (
  { interval = 1, until = Date.now, ...other }: { interval?: number, until?: ()=>number } & NumberFormat = {}
): Token => bar =>
  formatNumber(bar.elapsedTime(until()) / interval, other)

export const progress = (options: NumberFormat = {}): Token => bar =>
  formatNumber(bar.progress() * 100, options)

export const current = (options: NumberFormat = {}):Token => bar =>
  formatNumber(bar.current, options)

export const total = (options: NumberFormat = {}):Token => bar =>
  formatNumber(bar.total, options)

export const rate = (
  { interval = 1, ...other }: { interval?: number } & NumberFormat = {}
): Token => bar =>
  formatNumber(bar.rate() / interval, other)

export const eta = (
  { interval = 1, ...other }: { interval?: number } & NumberFormat = {}
): Token => bar =>
  formatNumber(bar.eta() / interval, other)
