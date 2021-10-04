// Regl Textures: https://github.com/regl-project/regl/blob/master/API.md#textures
import { make2d, make3d, map2d, map3d } from './array'
import { Coords } from './Coords'
import { none, sawtooth, sine, square, triangle, Waveform } from './Waveform'

/**
 * Radially maps a Waveform function over a square matrix
 * @param waveform function mapped over the matrix to describe the graph shape
 */
const matrixMap2d =
  (valueFn: (xy: Coords, size: number) => number) =>
  (waveform: Waveform) =>
  ({
    size = 50,
    periods = 2,
    transform = (value = 0, xy: Coords, time: number, size: number) => value,
    time = 0,
  } = {}) =>
    map2d(make2d(size), (_, coords) =>
      transform(
        waveform({ periods, size, value: time * size + valueFn(coords, size) }),
        coords,
        time,
        size,
      ),
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
const radialMap = matrixMap2d(byDistance)

export const radial = {
  // gauss: radialMap(gauss),
  sawtooth: radialMap(sawtooth),
  sine: radialMap(sine),
  square: radialMap(square),
  triangle: radialMap(triangle),
  none: radialMap(none),
} as const
