import { Card, IconButton, Slider } from '@material-ui/core'
import * as React from 'react'
import { radial } from './utils/2dDataGenerators'
import Heatmap from './components/Heatmap'
import {
  useAnimation,
  play,
  pause,
  reset,
  replay,
  animationState,
} from './hooks/useAnimation'
import { Picker } from './components/Picker'
import { useDux } from './useDux'

import PauseIcon from '@material-ui/icons/Pause'
import PlayArrow from '@material-ui/icons/PlayArrow'
import RefreshIcon from '@material-ui/icons/Refresh'
import ReplayIcon from '@material-ui/icons/Replay'
import StopIcon from '@material-ui/icons/Stop'

import { useState } from '@hookstate/core'
import { join } from './utils/join'
import { colorScales } from './colorScales'
import { useStyles } from './useStyles'

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
    sliderChangeCommitted: ({}, value: number | number[]) =>
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

  if (time >= 1)
    mainActionProps = {
      'aria-label': 'play',
      onClick: play,
      children: <PlayArrow />,
    }

  return (
    <>
      <div className={classes.root}>
        <Card className={join(classes.card, classes.waveforms)}>
          <Picker
            title="Waveform: "
            values={Object.keys(radial)}
            onChange={(waveform) => setState({ waveform })}
          />
        </Card>
        <main className={classes.main}>
          <Heatmap
            className={classes.heatmap}
            onClick={reset}
            data={radial[waveform as keyof typeof radial]({ ...options, time })}
            time={time}
            color={colorScales[colorScale as keyof typeof colorScales]}
          />
          <div>
            <IconButton {...mainActionProps} />
            {/* <IconButton aria-label="play" onClick={play}>
              <PlayArrow />
            </IconButton> */}
            <IconButton aria-label="pause" onClick={pause}>
              <PauseIcon />
            </IconButton>
            <IconButton aria-label="stop" onClick={reset}>
              <StopIcon />
            </IconButton>
            <IconButton aria-label="replay" onClick={replay}>
              <RefreshIcon />
            </IconButton>
            <Slider
              className={classes.slider}
              defaultValue={0}
              getAriaValueText={() => 'zero'}
              valueLabelDisplay="auto"
              step={0.01}
              min={0}
              max={1}
              value={sliderValue}
              onChange={(_, value) =>
                setState({ sliderValue: value as number })
              }
              onChangeCommitted={act.sliderChangeCommitted}
            />
          </div>
        </main>
        <Card className={join(classes.card, classes.colorScales)}>
          <Picker
            title="Set color scheme: "
            values={Object.keys(colorScales)}
            onChange={(colorScale) => setState({ colorScale })}
          />
        </Card>
      </div>
    </>
  )
}

export default App
