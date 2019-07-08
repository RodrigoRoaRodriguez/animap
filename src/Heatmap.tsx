import * as React from 'react'
import Texture from './Texture'
import * as d3 from 'd3'

export type Color = [number, number, number, number] //? 

export interface HeatmapData {
  width?: number
  height?: number
  data: number[]
}

interface ownProps {
  data: number[][] | HeatmapData
  range? : { max: number, min: number}
  color: (value: number) => string
  ref?: any
}

type props =  Omit<React.HTMLProps<HTMLCanvasElement>, keyof ownProps> & ownProps

function toColorInterpolator(transferFn: (value: number) => string) {
  return function interpolator(number: number) {
    const { r, g, b } = d3.rgb(transferFn(number))
    return [r, g, b, 255] as Color
  }
}

function normalize(max = 1, min = 0) {
  return value => (value - min) / (max - min)
}


type args = {
  color?: (id: any) => any;
  data?: number[][] | HeatmapData;
  range?: {
      max?: number;
      min?: number;
  };
}
// TODO: non-linear color scales
// TODO: nested array as data
function getPixels({
  color = (id: any) => id,
  data = [[255, 0, 0, 255], [0, 255, 0, 255], [0, 0, 255, 255], [0, 0, 0, 255]],
  range: {
    max = Math.max(...(Array.isArray(data) ? data.flat() : data.data.flat())),
    min = Math.min(...(Array.isArray(data) ? data.flat() : data.data.flat())),
  } = {},
}:args = {} ) {
  const colorize = toColorInterpolator(value =>
    color(normalize(max, min)(value)),
  )

  if ((data as any).data) { 
    const { data: array = data, ...rest } = data as any
    const pixels = {
      ...rest,
      data: array.flatMap(colorize),
    }
    return pixels
  } else {
    return (data as any).map2d(colorize)
  }
}

// Ideas to make it performant:
// 1. Use hooks and bake in all the data into pixels
// 2. Rerender the texture not the heatmap
// 3. Send in the whole animation
// 4. Frame-caching
const Heatmap = ({ color, data, range, ...canvasProps }: props) => (
  <Texture {...canvasProps} data={getPixels({ color, data, range })} />
)

export default Heatmap
