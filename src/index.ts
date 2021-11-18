import ProgressBar, {Events} from "./ProgressBar";
import {WriteStream} from "tty";
import {Token} from "./token";
import {StreamProgressBarRenderer} from "./ProgressBarRenderer";
import RenderTrigger from "./RenderTrigger";

export * as Tokens from './token';
export * from './ProgressBar';
export * from './ProgressBarRenderer';
export { default as RenderTrigger } from './RenderTrigger';
export { default as ProgressBar } from './ProgressBar';

export function initSimpleBar({ bar, template, tokens, stream }: {
  bar: ProgressBar
  template: string,
  tokens: { [_: string]: Token },
  stream: WriteStream,
}) {
  return new StreamProgressBarRenderer(template, tokens, stream)
    .attach(self => new RenderTrigger(self, bar, Events.TICK))
}
