/*
 * Copyright 2021 Nathan P. Bombana
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import EventEmitter from "events";

export interface ProgressBarState {
  current: number
  total: number
  startTime: number
  title: string
  rate(): number
  elapsedTime(since: number): number
  progress(): number
  eta(): number
  isComplete(): boolean
}

export enum Events {
  TICK = 'tick',
  COMPLETED = 'completed',
  REACTIVATED = 'reactivated'
}

export default class ProgressBar extends EventEmitter implements ProgressBarState {
  private _current: number = 0
  public get current() { return this._current }
  public set current(value: number) {
    this._current = Math.max(value, 0)
    this.checkCompleteEvent()
  }

  private _total: number = 0
  public get total() { return this._total }
  public set total(value: number) {
    this._total = Math.max(value, 0)
    this.checkCompleteEvent()
  }

  private _completeEventEmitted = false
  private get completeEventEmitted() { return this._completeEventEmitted }
  private set completeEventEmitted(value: boolean) {
    if (this.completeEventEmitted && !value) this.emit(Events.REACTIVATED)
    this._completeEventEmitted = value
  }

  public title: string
  public readonly startTime = Date.now();

  eventNames(): Array<string> {
    return Object.values(Events);
  }

  constructor({ current, total, title }: { current?: number, total?: number, title?: string } = {}) {
    super()
    this.current = current ?? this.current;
    this.total = total ?? this.total
    this.title = title ?? ''
    this.checkCompleteEvent()
  }

  private checkCompleteEvent() {
    if (this.completeEventEmitted && !this.isComplete()) {
      this.completeEventEmitted = false
    }

    if (this.isComplete() && this.current > 0 && !this.completeEventEmitted) {
      this.completeEventEmitted = true
      this.emit(Events.COMPLETED)
    }
  }

  public tick(value: number) {
    const incValue = (this.current + value) > this.total
      ? Math.min(this.total - this.current, value)
      : value

    this.current += incValue
    this.emit(Events.TICK, incValue)
  }

  public rate(): number {
    const elapsedTime = this.elapsedTime(Date.now())
    return elapsedTime === 0
      ? Infinity
      : this.current / elapsedTime
  }

  public elapsedTime(since: number): number {
    return since - this.startTime
  }

  public progress(): number {
    return this.current === 0 && this.total === 0
    ? 1
    : this.current / (this.total || 1)
  }

  public eta(): number {
    return this.isComplete()
      ? 0
      : (this.elapsedTime(Date.now()) * (this.total / this.current)) - this.elapsedTime(Date.now())
  }

  public isComplete(): boolean {
    return this.current >= this.total
  }

}
