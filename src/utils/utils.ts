import SimplexNoise from 'simplex-noise'
import { Coords } from './Coords'

const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max)

const simplex = new SimplexNoise()

export const addNoise =
  (magnitude = 0) =>
  (value = 0, { x, y }: Coords, time: number) =>
    clamp(value + simplex.noise4D(x, y, value, time) * magnitude, -1, 1)

export function normalize(max = 1, min = 0) {
  return (value: number) => (value - min) / (max - min)
}
