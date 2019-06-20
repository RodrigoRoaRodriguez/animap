import * as React from 'react'
import Texture, { Color } from './Texture'
import * as d3 from 'd3'

export type Color = [number, number, number, number]

interface HeatmapData {
  width: number
  height: number
  max: number
  min: number
  data: number[]
}

interface ownProps {
  data: HeatmapData
  color: (value: number) => string
}

type props = React.HTMLProps<HTMLCanvasElement> & ownProps
function toColorInterpolator(transferFn: (value: number) => string) {
  return function interpolator(number: number) {
    const { r, g, b } = d3.rgb(transferFn(number))
    return [r, g, b, 255] as Color
  }
}

function normalize(max = 1, min = 0) {
  return value => (value - min) / (max - min)
}

// TODO: non-linear color scales
// TODO: nested array as data
function getPixels({
  color = id => id,
  data = [255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255, 0, 0, 0, 255],
  range: {
    max = Math.min(...data.flat()),
    min = Math.max(...data.flat()),
  } = {},
} = {}) {
  console.log(data.flat())
  const colorize = toColorInterpolator(value =>
    color(normalize(max, min)(value)),
  )
  if (data.data) {
    const { data: array = data, ...rest } = data
    const pixels = {
      ...rest,
      data: array.flatMap(colorize),
    }
    return pixels
  } else {
    return data.map(colorize)
  }
}

// Ideas to make it performant:
// 1. Use hooks and bake in all the data into pixels
// 2. Rerender the texture not the heatmap
// 3. Send in the whole anymation
// 4. Frame-caching
const Heatmap = ({ color, data, min, max, ...canvasProps }) => (
  <Texture {...canvasProps} data={getPixels({ color, data, min, max })} />
)

export default Heatmap
