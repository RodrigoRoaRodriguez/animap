import SimplexNoise from 'simplex-noise'
import { Coords } from './Coords'

type fn2d = (
  index: number,
  coordinates: { x: number; y: number },
  thisArg: XYMatrix,
) => number

export class XYMatrix extends Array<number[]> {
  constructor({ size = 0, width = size as number, height = width as number }) {
    super(width)
    this.fill([...Array(height).keys()])
  }

  /**
   * Maps a function on every element of the matrix and returns an array of
   * arrays that contains the results.
   */
  map2d = (fn: fn2d) =>
    super.map((row, y) => row.map((value, x) => fn(value, { x, y }, this)))
}

const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max)

// export const addNoise =
//   (magnitude = 0) =>
//   (value = 0) =>
//     clamp(value + (Math.random() - 0.5) * 2 * magnitude, -1, 1)

const simplex = new SimplexNoise()

export const addNoise =
  (magnitude = 0) =>
  (value = 0, { x, y }: Coords) =>
    clamp(value + simplex.noise3D(x, y, value) * magnitude, -1, 1)
// clamp(value + simplex.noise3D(x, y, value) * magnitude, -1, 1)

export function normalize(max = 1, min = 0) {
  return (value: number) => (value - min) / (max - min)
}
