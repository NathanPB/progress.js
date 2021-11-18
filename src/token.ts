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

export type Token = (bar: ProgressBarState)=>string

export const bar = (
  { length, fill = '=', head = fill, empty = ' '}:
  { length: number, fill?: string, empty?: string, head?: string }
):Token => bar => {
  const percent = bar.current / bar.total
  const fillLength = Math.round(length * percent)
  return new Array(fillLength)
    .map((_, idx) => idx < fillLength ? idx === fillLength ? head : fill : empty)
    .join("")
}

export const elapsedTime = (
  { interval = 1000 }: { interval?: number } = {}
): Token => bar =>
  String(bar.elapsedTime(Date.now()) * interval)


export const progress = (
  { decimalDigits = 2, hundred = true }: { decimalDigits?: number, hundred?: boolean } = {}
): Token => {
  return hundred
    ? bar => (bar.progress() * 100).toFixed(decimalDigits)
    : bar => bar.progress().toFixed(decimalDigits)
}

export const current = ():Token => bar => String(bar.current)

export const total = ():Token => bar => String(bar.total)

export const rate = (
  { interval = 1000 }: { interval?: number } = {}
): Token => bar => String(bar.rate() * interval)

export const eta = (
  { interval = 1000 }: { interval?: number } = {}
): Token => bar => String(bar.eta() * interval)
