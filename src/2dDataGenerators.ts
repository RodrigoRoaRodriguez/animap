// Regl Textures: https://github.com/regl-project/regl/blob/master/API.md#textures
import { XYMatrix } from './utils'
import { Waveform, gauss, triangle, sawtooth, sine, square } from './Waveform'

/**
 * Horizontally maps a Waveform function over a square matrix
 * @param waveform a waveform function mapped over the matrix
 */
const horizontalMap = (waveform: Waveform) => ({ size = 50, periods = 2 } = {}) =>
  new XYMatrix({ size }).map2d(value => waveform({ periods, size, value }))

/* Generators */
export const horizontal = {
  gauss: horizontalMap(gauss),
  triangle: horizontalMap(triangle),
  sawtooth: horizontalMap(sawtooth),
  sine: horizontalMap(sine),
  square: horizontalMap(square),
}

/**
 * Radially maps a Waveform function over a square matrix
 * @param waveform function mapped over the matrix to describe the graph shape
 */
const radialMap = (waveform: Waveform) => ({ size = 50, periods = 2, transform= (value=0) => value } = {}) =>
  new XYMatrix({ size }).map2d((_, {x,y}, matrix) => transform(waveform({ periods, size, value: Math.sqrt((x-(size-1)/2)**2 + (y-(size-1)/2)**2)})))

/* Generators */ 
export const radial = {
  gauss: radialMap(gauss),
  triangle: radialMap(triangle),
  sawtooth: radialMap(sawtooth),
  sine: radialMap(sine),
  square: radialMap(square),
}

