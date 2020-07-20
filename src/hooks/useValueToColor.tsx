import { normalize } from '../utils/utils';
import { map2d } from '../utils/array';
import { placeholderData, Args, toColorInterpolator } from '../Heatmap';

export function useValueToColor({
  color = (id: number) => id,
  data = placeholderData,
  range: {
    max = Math.max(...data.flat()),
    min = Math.min(...data.flat()), } = {}, }: Args = {}) {
  const colorize = toColorInterpolator(value => color(normalize(max, min)(value)));
  return map2d(data, colorize);
}
