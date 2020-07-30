import * as d3 from 'd3';
import { Color } from '../types/Color';
import { map2d } from '../utils/array';
import { normalize } from '../utils/utils';

export function toColorInterpolator(transferFn: (value: number) => string) {
  return function interpolator(number: number) {
    const { r, g, b } = d3.rgb(transferFn(number))
    return [r, g, b, 255] as Color
  }
}

export const placeholderData = [
  [255, 0, 0, 255],
  [0, 255, 0, 255],
  [0, 0, 255, 255],
  [0, 0, 0, 255],
];

export type Args = {
  color?: (id: any) => any
  data?: number[][] 
  range?: {
    max?: number
    min?: number
  }
}

export function useValueToColor({
  color = d3.interpolateHclLong('#012', '#ff6'),
  data = placeholderData,
  range: {
    max = Math.max(...data.flat()),
    min = Math.min(...data.flat()), } = {}, }: Args = {}) {
  const colorize = toColorInterpolator(value => color(normalize(max, min)(value)));
  return map2d(data, colorize);
}