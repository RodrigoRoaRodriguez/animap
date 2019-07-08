// Regl Textures: https://github.com/regl-project/regl/blob/master/API.md#textures
import { XYMatrix } from './utils'

export function squareWrap<T>(data: Array<T>) {
  const size = Math.sqrt(data.length)
  return { width: size, height: size, data }
}

export const flatArray = squareWrap(
  // prettier-ignore
  [ 255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255, 0, 0, 0, 255, ],
)

export const squareMatrix = (side = 3) =>
  squareWrap(Array.from(Array(side * side).keys()).map(n => n / (side * side)))

/**
 * Calculates a 2D Gaussian matrix.
 * @param  {Number} size       The dimensions of the 2D matrix.
 * @param  {Number} radius       Determines the speed of value falloff
 * @return {Array}      A 2D convolution square matrix.
 */
export function gauss2dArray(size = 2, radius = 3) {
  const length = size * size
  const matrix = Array(length).fill(0)
  // Calculate the top left corner and mirror it for the other three sectors
  for (let y = 0; y < size / 2; ++y) {
    for (let x = 0; x < size / 2; ++x) {
      const position = y * size + x
      const xFlipped = (y + 1) * size - x - 1
      const yFlipped = length - 1 - xFlipped
      const xyFlipped = length - 1 - position

      const squaredDistance =
        (y - (size - 1) / 2) ** 2 + (x - (size - 1) / 2) ** 2
      const value = Math.exp(-1 * (squaredDistance / (2 * radius ** 2)))
      matrix[position] = value
      matrix[xFlipped] = value
      matrix[yFlipped] = value
      matrix[xyFlipped] = value
    }
  }
  return matrix
}

export const squareArray = <T>(array: T[]) =>
  Array(array.length).fill(array) as T[][]

// Normalized linear range with n steps
export const normRange = (size: number) =>
  [...Array(size)].map((_, i) => i / (size - 1))

/* Waveforms */
type Waveform = (args: {
  periods: number
  size: number
  value: number
}) => number

const sawtooth: Waveform = ({ periods, size, value }) =>
  (size - Math.abs((value % (size / periods)) - size)) / size

const sine: Waveform = ({ periods, size, value }) =>
  Math.sin((value / (size - 1)) * Math.PI * 2 * periods)

const square: Waveform = ({ periods, size, value }) =>
  Math.sin((value / (size - 1)) * Math.PI * 2 * periods) > 0 ? 1 : -1

const triangle: Waveform = ({ periods, size, value }) =>
  1 - Math.abs((((value * periods * 2) / (size - 1)) % 2) - 1)


/**
 * Horizontally maps a Waveform function over a square matrix
 * @param waveform a waveform function mapped over the matrix
 */
const horizontalMap = (waveform: Waveform) => ({ size = 50, periods = 2 } = {}) =>
  new XYMatrix({ size }).map2d(value => waveform({ periods, size, value }))

/* Generators */
export const horizontal = {
  triangle: horizontalMap(triangle),
  sawtooth: horizontalMap(sawtooth),
  sine: horizontalMap(sine),
  square: horizontalMap(square),
}

export function gaussMatrix(size?: number, radius = 2) {
  return squareWrap(gauss2dArray(size, radius))
}
