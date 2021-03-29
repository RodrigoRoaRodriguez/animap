import { Button, Card, IconButton, makeStyles, Slider } from '@material-ui/core'
import * as React from 'react'
import { radial } from './utils/2dDataGenerators'
import Heatmap from './components/Heatmap'
import {
  useAnimation,
  play,
  pause,
  reset,
  animationState,
} from './hooks/useAnimation'
import { Picker } from './components/Picker'
import { useDux } from './useDux'

import PauseIcon from '@material-ui/icons/Pause'
import PlayArrow from '@material-ui/icons/PlayArrow'
import ReplayIcon from '@material-ui/icons/Replay'
import StopIcon from '@material-ui/icons/Stop'

import { useState } from '@hookstate/core'
import { join } from './utils/join'
import { colorScales } from './colorScales'

const PADDING = 0.2
export const getSize = () => {
  let size = Math.min(window.innerWidth, window.innerHeight) / (1.5 + PADDING)
  return { width: size, height: size }
}

const options = {
  // transform: addNoise(0.5),
  // periods: 2,
  size: 150,
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'grid',
    flexGrow: 1,
    gridTemplateAreas: '"waveforms heatmap colorScales"',
  },
  card: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  waveforms: {
    gridArea: 'waveforms',
  },
  colorScales: {
    gridArea: 'colorScales',
  },
  heatmap: {
    gridArea: 'heatmap',
    height: '100%',
    width: '100%',
    borderRadius: 4,
  },
  slider: {
    width: getSize().width,
    gridArea: 'colorScale',
  },
}))

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
  return (
    <>
      <h1>Heatmap {String(state.playing.get())}</h1>
      <h2>Keep working to see some magic happen 🌈✨</h2>
      <h2>time: {Math.round(time * 100)}%</h2>
      <div className={classes.root}>
        <Card className={join(classes.card, classes.waveforms)}>
          <Picker
            title="Waveform: "
            values={Object.keys(radial)}
            onChange={(waveform) => setState({ waveform })}
          />
        </Card>
        <Heatmap
          onClick={reset}
          className={classes.heatmap}
          data={radial[waveform as keyof typeof radial]({ ...options, time })}
          time={time}
          color={colorScales[colorScale as keyof typeof colorScales]}
        />
        <Card className={join(classes.card, classes.colorScales)}>
          <Picker
            title="Set color scheme: "
            values={Object.keys(colorScales)}
            onChange={(colorScale) => setState({ colorScale })}
          />
        </Card>
      </div>

      <IconButton aria-label="play" onClick={play}>
        <PlayArrow />
      </IconButton>
      <IconButton aria-label="pause" onClick={pause}>
        <PauseIcon />
      </IconButton>
      <IconButton aria-label="stop" onClick={reset}>
        <StopIcon />
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
        onChange={(_, value) => setState({ sliderValue: value as number })}
        onChangeCommitted={act.sliderChangeCommitted}
      />
      <Button onClick={() => setTime(0)}>Reset</Button>
      <Button onClick={act.printWaveForm}>Print waveform</Button>
    </>
  )
}

export default App
