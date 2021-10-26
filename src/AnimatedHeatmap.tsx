import { colorScales } from './colorScales'
import Heatmap from './components/Heatmap'
import { radial } from './utils/2dDataGenerators'
import { addNoise } from './utils/utils'

export function AnimatedHeatmap({
  onClick,
  waveform,
  noiseMagnitude,
  time,
  colorScale,
}: {
  onClick: any
  waveform: string
  noiseMagnitude: number
  time: number
  colorScale: string
}) {
  return (
    <Heatmap
      onClick={onClick}
      data={radial[waveform as keyof typeof radial]({
        transform: addNoise(noiseMagnitude),
        periods: 4,
        size: 100,
        time,
      })}
      time={time}
      color={colorScales[colorScale as keyof typeof colorScales]}
    />
  )
}
