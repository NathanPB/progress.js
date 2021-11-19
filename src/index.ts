import {WriteStream} from "tty";
import {Events, ProgressBar} from "./ProgressBar";
import {TokenDict} from "./token";
import {RenderTrigger, TTYMultiProgressBarRenderer, TTYProgressBarRenderer} from "./render";

export {TokenDict, Token} from './token'
export * as Tokens from './token';
export * from './ProgressBar';
export * from './render';

export function initSimpleBar({ bar, template, tokens, stream }: {
  bar: ProgressBar
  template: string,
  tokens: TokenDict,
  stream: WriteStream,
}) {
  return new TTYProgressBarRenderer(template, tokens, stream)
    .attach(self => new RenderTrigger(self, bar, Events.TICK))
}

export function initMultiBar({ bars, template, tokens, stream }: {
  bars: ProgressBar[],
  template: string,
  tokens: TokenDict,
  stream: WriteStream
}) {
  const renderer = new TTYMultiProgressBarRenderer(template, tokens, bars, stream)
  bars.forEach(bar => renderer.attach(self => new RenderTrigger(self, bar, Events.TICK)))
  return renderer
}
