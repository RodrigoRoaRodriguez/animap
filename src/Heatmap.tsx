import * as React from 'react'
import Texture from './Texture'
import * as d3 from 'd3'
import { normalize } from './utils'
export type Color = [number, number, number, number] //?

interface ownProps {
  data: number[][]
  range?: { max: number; min: number }
  color: (value: number) => string
  ref?: any
  time: number
}

type props = Omit<React.HTMLProps<HTMLCanvasElement>, keyof ownProps> & ownProps

function toColorInterpolator(transferFn: (value: number) => string) {
  return function interpolator(number: number) {
    const { r, g, b } = d3.rgb(transferFn(number))
    return [r, g, b, 255] as Color
  }
}

type Args = {
  color?: (id: any) => any
  data?: number[][] 
  range?: {
    max?: number
    min?: number
  }
}

const placeholderData = [
  [255, 0, 0, 255],
  [0, 255, 0, 255],
  [0, 0, 255, 255],
  [0, 0, 0, 255],
];

function getPixels({
  color = (id: any) => id,
  data = placeholderData,
  range: {
    max = Math.max(...data.flat()),
    min = Math.min(...data.flat()),
  } = {},
}: Args = {}) {
  const colorize = toColorInterpolator(value =>
    color(normalize(max, min)(value)),
  )

    return (data as any).map2d(colorize)
}

const Heatmap = ({ color, data, range, ...canvasProps }: props) => {
  return <Texture {...canvasProps} data={getPixels({ color, data, range })} />
}


export default Heatmap
