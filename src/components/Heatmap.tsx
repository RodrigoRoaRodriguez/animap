import * as React from 'react'
import { useHardcodedValueToColor } from '../hooks/useValueToColor'
import Texture from '../utils/Texture'

interface OwnProps {
  pixelValues: number[][]
  range?: { max: number; min: number }
  colorScale: (value: number) => string
  time: number
}

type Props = Omit<React.HTMLProps<HTMLCanvasElement>, keyof OwnProps> & OwnProps

const Heatmap = ({ colorScale, pixelValues, range, ...canvasProps }: Props) => {
  const pixels = useHardcodedValueToColor({ colorScale, pixelValues, range })
  return <Texture {...canvasProps} pixels={pixels} />
}

export default Heatmap
