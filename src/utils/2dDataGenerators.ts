// Regl Textures: https://github.com/regl-project/regl/blob/master/API.md#textures
import { make2d, map2d } from './array'
import { Coords } from './Coords'
import { Waveform } from './Waveform'

/**
 * Maps a waveform over a square matrix via an x,y to value function.
 * @param waveform function mapped over the matrix to describe the graph shape
 */
export const matrixMap2d =
  (xyToValueFn: (xy: Coords, size: number) => number) =>
  (waveform: Waveform) =>
  ({
    size = 50,
    periods = 2,
    transform = (value = 0, xy: Coords, time: number, size: number) => value,
    time = 0,
  } = {}) =>
    map2d(make2d(size), (_, coords) =>
      transform(
        waveform({
          periods,
          size,
          value: time * size + xyToValueFn(coords, size),
        }),
        coords,
        time,
        size,
      ),
    )

/**
 * Measures Euclidean distance between the center of the chart and a coordianate
 * (x,y), assuming integer non-normalized device coordinates from 0 to size.
 * @param coords 2d coordinates
 * @param size length of the coordinate system
 */
const byDistanceFromCenter = ({ x, y }: Coords, size = 1) =>
  Math.sqrt((x - (size - 1) / 2) ** 2 + (y - (size - 1) / 2) ** 2)

const byHorizontalDistance = ({ x, y }: Coords) => x
const byVerticalDistance = ({ x, y }: Coords) => y

/**
 * Radially maps a Waveform function over a square matrix
 * @param waveform function mapped over the matrix to describe the graph shape
 */
// export const radialWaveform = matrixMap2d(byDistanceFromCenter)
export const radialWaveform = matrixMap2d(byDistanceFromCenter)
