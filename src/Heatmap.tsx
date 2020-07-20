import * as React from 'react'
import Texture from './Texture'
import * as d3 from 'd3'
import { Color } from './types/Color'
import { useValueToColor } from './hooks/useValueToColor'

interface ownProps {
  data: number[][]
  range?: { max: number; min: number }
  color: (value: number) => string
  ref?: any
  time: number
}

type props = Omit<React.HTMLProps<HTMLCanvasElement>, keyof ownProps> & ownProps

export function toColorInterpolator(transferFn: (value: number) => string) {
  return function interpolator(number: number) {
    const { r, g, b } = d3.rgb(transferFn(number))
    return [r, g, b, 255] as Color
  }
}

export type Args = {
  color?: (id: any) => any
  data?: number[][] 
  range?: {
    max?: number
    min?: number
  }
}

export const placeholderData = [
  [255, 0, 0, 255],
  [0, 255, 0, 255],
  [0, 0, 255, 255],
  [0, 0, 0, 255],
];

const Heatmap = ({ color, data, range, ...canvasProps }: props) => {
  const pixels = useValueToColor({ color, data, range })
  return <Texture {...canvasProps} pixels={pixels} />
}


export default Heatmap
