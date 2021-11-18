import ProgressBar, {Events} from "./ProgressBar";
import {WriteStream} from "tty";
import {TokenDict} from "./token";
import {TTYMultiProgressBarRenderer, TTYProgressBarRenderer} from "./render/ProgressBarRenderer";
import RenderTrigger from "./render/RenderTrigger";

export * as Tokens from './token';
export * from './ProgressBar';
export * from './render/ProgressBarRenderer';
export { default as RenderTrigger } from './render/RenderTrigger';
export { default as ProgressBar } from './ProgressBar';

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
  const renderer = new TTYMultiProgressBarRenderer(template, tokens, stream, bars)
  bars.forEach(bar => renderer.attach(self => new RenderTrigger(self, bar, Events.TICK)))
  return renderer
}
