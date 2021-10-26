import * as React from 'react'
import { useHardcodedValueToColor } from '../hooks/useValueToColor'
import Texture from '../Texture'

interface ownProps {
  data: number[][]
  range?: { max: number; min: number }
  color: (value: number) => string
  time: number
}

type props = Omit<React.HTMLProps<HTMLCanvasElement>, keyof ownProps> & ownProps

const Heatmap = ({ color, data, range, ...canvasProps }: props) => {
  const pixels = useHardcodedValueToColor({ color, data, range })
  return <Texture {...canvasProps} pixels={pixels} />
}

export default Heatmap
