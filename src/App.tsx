import {
  Button,
  Card,
  Grid,
  IconButton,
  makeStyles,
  Slider,
} from '@material-ui/core'
import * as d3 from 'd3'
import * as React from 'react'
import { radial } from './utils/2dDataGenerators'
import Heatmap from './components/Heatmap'
import { useAnimation, play } from './hooks/useAnimation'
import { Picker } from './components/Picker'
import { useDux } from './useDux'

import PauseIcon from '@material-ui/icons/Pause'
import PlayArrow from '@material-ui/icons/PlayArrow'
import StopIcon from '@material-ui/icons/Stop'

declare module 'd3' {
  export function interpolateTurbo(t: number): string
  export function interpolateCividis(t: number): string
}

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
    flexGrow: 1,
  },
  card: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  slider: {
    width: getSize().width,
  },
}))

const colorScales = {
  "Rodrigo's": d3.interpolateHclLong('#012', '#ff6'),
  Turbo: d3.interpolateTurbo,
  Inferno: d3.interpolateInferno,
  Cividis: d3.interpolateCividis,
  Viridis: d3.interpolateViridis,
  Warm: d3.interpolateWarm,
  Cool: d3.interpolateCool,
  CubeHelix: d3.interpolateCubehelixDefault,
}

const initialState = {
  waveform: Object.keys(radial)[0],
  colorScale: Object.keys(colorScales)[0],
  sliderValue: 0,
}

const App = () => {
  const [time, reset, setTime] = useAnimation() // { deps: [waveform] })
  const {
    state: { waveform, colorScale, sliderValue },
    setState,
    act,
  } = useDux(initialState, (state) => ({
    printWaveForm: () => alert(state.waveform),
    reset: () => setTime(0),
    play: () => setTime(0),
    pause: () => setTime(0),
    setWaveform: (waveform: string) => setState({ waveform }),
    sliderChangeCommitted: ({}, value: number | number[]) =>
      setTime(value as number),
  }))

  const classes = useStyles({})

  React.useEffect(() => {
    setState({ sliderValue: time })
  }, [time, setState])

  return (
    <>
      <h1>Heatmap {waveform}</h1>
      <h2>Keep working to see some magic happen 🌈✨</h2>
      <h2>time: {Math.round(time * 100)}%</h2>
      <Card className={classes.card}>
        <Picker
          title="Waveform: "
          values={Object.keys(radial)}
          onChange={(waveform) => setState({ waveform })}
        />
      </Card>
      <Heatmap
        onClick={reset}
        style={{ ...getSize(), borderRadius: 4 }}
        data={radial[waveform as keyof typeof radial]({ ...options, time })}
        time={time}
        color={colorScales[colorScale as keyof typeof colorScales]}
      />
      <Card className={classes.card}>
        <Picker
          title="Set color scheme: "
          values={Object.keys(colorScales)}
          onChange={(colorScale) => setState({ colorScale })}
        />
      </Card>
      <IconButton aria-label="play">
        <PlayArrow />
      </IconButton>
      <IconButton aria-label="pause">
        <PauseIcon />
      </IconButton>
      <IconButton aria-label="stop">
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
