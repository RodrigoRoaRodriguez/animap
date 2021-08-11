import { useState } from '@hookstate/core'
import { Card, IconButton, Slider } from '@material-ui/core'
import PauseIcon from '@material-ui/icons/Pause'
import PlayArrow from '@material-ui/icons/PlayArrow'
import RefreshIcon from '@material-ui/icons/Refresh'
import ReplayIcon from '@material-ui/icons/Replay'
import StopIcon from '@material-ui/icons/Stop'
import * as React from 'react'
import { colorScales } from './colorScales'
import Heatmap from './components/Heatmap'
import { Picker } from './components/Picker'
import {
  animationState,
  pause,
  play,
  replay,
  useAnimation,
} from './hooks/useAnimation'
import { useDux } from './useDux'
import { useStyles } from './useStyles'
import { radial } from './utils/2dDataGenerators'
import { join } from './utils/join'

const options = {
  // transform: addNoise(0.5),
  // periods: 2,
  size: 150,
}

const initialState = {
  waveform: Object.keys(radial)[0],
  colorScale: Object.keys(colorScales)[0],
  sliderValue: 0,
}

const App = () => {
  const [time, setTime] = useAnimation() // { deps: [waveform] })
  const {
    state: { waveform, colorScale, sliderValue },
    setState,
    act,
  } = useDux(initialState, (state) => ({
    printWaveForm: () => alert(state.waveform),
    setWaveform: (waveform: string) => setState({ waveform }),
    sliderChangeCommitted: (_: any, value: number | number[]) =>
      setTime(value as number),
  }))

  const classes = useStyles({})

  React.useEffect(() => {
    setState({ sliderValue: time })
  }, [time, setState])
  const state = useState(animationState)

  let mainActionProps = {
    'aria-label': 'play',
    onClick: play,
    children: <PlayArrow />,
  }

  if (state.playing.get())
    mainActionProps = {
      'aria-label': 'pause',
      onClick: pause,
      children: <PauseIcon />,
    }

  if (time >= 1)
    mainActionProps = {
      'aria-label': 'replay',
      onClick: replay,
      children: <RefreshIcon />,
    }

  return (
    <div className={classes.root}>
      <main className={classes.main}>
        <Heatmap
          className={classes.heatmap}
          onClick={mainActionProps.onClick}
          data={radial[waveform as keyof typeof radial]({ ...options, time })}
          time={time}
          color={colorScales[colorScale as keyof typeof colorScales]}
        />
      </main>
      <div className={classes.options}>
        <Card className={classes.card}>
          <Picker
            title="Waveform: "
            values={Object.keys(radial)}
            onChange={(waveform) => setState({ waveform })}
          />
        </Card>
        <Card className={join(classes.card, classes.options)}>
          <Picker
            title="Set color scheme: "
            values={Object.keys(colorScales)}
            onChange={(colorScale) => setState({ colorScale })}
          />
        </Card>
      </div>
      <div className={classes.controls}>
        <IconButton {...mainActionProps} />
        <Slider
          className={classes.slider}
          defaultValue={0}
          getAriaValueText={() => 'zero'}
          valueLabelDisplay="auto"
          step={0.01}
          min={0}
          max={1}
          value={sliderValue}
          onChange={(_, value) => setState({ sliderValue: value as number })}
          onChangeCommitted={act.sliderChangeCommitted}
        />
      </div>
    </div>
  )
}

export default App
