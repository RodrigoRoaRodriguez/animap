// Regl Textures: https://github.com/regl-project/regl/blob/master/API.md#textures
import { XYMatrix } from './utils'
import { Waveform, gauss, triangle, sawtooth, sine, square } from './Waveform'

/**
 * Horizontally maps a Waveform function over a square matrix
 * @param waveform a waveform function mapped over the matrix
 */
const horizontalMap = (waveform: Waveform) => ({
  size = 50,
  periods = 2,
} = {}) =>
  new XYMatrix({ size }).map2d(value => waveform({ periods, size, value }))

/* Generators */
export const horizontal = {
  // gauss: horizontalMap(gauss),
  sawtooth: horizontalMap(sawtooth),
  sine: horizontalMap(sine),
  square: horizontalMap(square),
  triangle: horizontalMap(triangle),
}

type Coords = {
  x: number
  y: number
}

/**
 * Radially maps a Waveform function over a square matrix
 * @param waveform function mapped over the matrix to describe the graph shape
 */
const matrixMap = (valueFn: (xy: Coords, size: number) => number) => (
  waveform: Waveform
) => ({
  size = 50,
  periods = 2,
  transform = (value = 0) => value,
  time = 0,
} = {}) =>
  new XYMatrix({ size }).map2d((_, coords) =>
    transform(
      waveform({ periods, size, value: time * size + valueFn(coords, size) })
    )
  )

/**
 * Measures Euclidean distance between the center of the chart and a coordianate
 * (x,y), assuming integer non-normalized device coordinates from 0 to size.
 * @param coords 2d coordinates
 * @param size length of the coordin
 */
const byDistance = ({ x, y }: Coords, size = 1) =>
  Math.sqrt((x - (size - 1) / 2) ** 2 + (y - (size - 1) / 2) ** 2)

/**
 * Radially maps a Waveform function over a square matrix
 * @param waveform function mapped over the matrix to describe the graph shape
 */
const radialMap = matrixMap(byDistance)

/* Generators */

export const radial = {
  // gauss: radialMap(gauss),
  sawtooth: radialMap(sawtooth),
  sine: radialMap(sine),
  square: radialMap(square),
  triangle: radialMap(triangle),
} as const
