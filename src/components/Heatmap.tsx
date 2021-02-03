import * as React from 'react'
import Texture from '../Texture'
import { useValueToColor } from '../hooks/useValueToColor'

interface ownProps {
  data: number[][]
  range?: { max: number; min: number }
  color: (value: number) => string
  time: number
}

type props = Omit<React.HTMLProps<HTMLCanvasElement>, keyof ownProps> & ownProps

const Heatmap = ({ color, data, range, ...canvasProps }: props) => {
  const pixels = useValueToColor({ color, data, range })
  return <Texture {...canvasProps} pixels={pixels} />
}

export default Heatmap
