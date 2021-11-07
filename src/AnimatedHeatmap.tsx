import { colorScales } from './colorScales'
import Heatmap from './components/Heatmap'
import { radial } from './utils/2dDataGenerators'
import { addNoise } from './utils/utils'

interface Props {
  onClick: any
  waveform: string
  noiseMagnitude: number
  time: number
  colorScale: string
}

export function AnimatedHeatmap({
  onClick,
  waveform,
  noiseMagnitude,
  time,
  colorScale,
  ...canvasProps
}: Props & React.HTMLProps<HTMLCanvasElement>) {
  return (
    <Heatmap
      onClick={onClick}
      pixelValues={radial[waveform as keyof typeof radial]({
        transform: addNoise(noiseMagnitude),
        periods: 4,
        size: 100,
        time,
      })}
      time={time}
      colorScale={colorScales[colorScale as keyof typeof colorScales]}
      {...canvasProps}
    />
  )
}
