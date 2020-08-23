import { Card, Grid, makeStyles, Slider } from '@material-ui/core'
import * as d3 from 'd3'
import * as React from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import { radial } from './2dDataGenerators'
import Heatmap from './Heatmap'
import { useAnimation } from './hooks/useAnimation'
import { Picker } from './Picker'

declare module 'd3' {
  export function interpolateTurbo(t: number): string
  export function interpolateCividis(t: number): string
}

const Title = styled.h1`
  color: #eef;
  font-weight: 400;
  margin-bottom: 0;
`

const Sub = styled.h2`
  font-weight: 100;
  margin-top: 0.5em;
`

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

const App = () => {
  // const [waveform, setWaveform] = React.useContext(waveformContext)
  const [waveform, setWaveform] = useState(Object.keys(radial)[0])
  const [colorScale, setColorScale] = useState(Object.keys(colorScales)[0])

  const [time, reset, setTime] = useAnimation({ deps: [waveform] })
  const classes = useStyles({})
  const [sliderValue, setSliderValue] = useState(0)
  React.useEffect(() => {
    setSliderValue(time)
  }, [time])

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.root}
    >
      <Title>Heatmap {waveform}</Title>
      <Sub>Keep working to see some magic happen 🌈✨</Sub>
      <h2>time: {Math.round(time * 100)}%</h2>
      <Grid container justify="center" spacing={2}>
        <Grid
          container
          item
          alignContent="space-between"
          spacing={2}
          sm={12}
          md={2}
        >
          <Card className={classes.card}>
            <Picker
              title="Waveform: "
              values={Object.keys(radial)}
              onChange={setWaveform}
            />
          </Card>
        </Grid>
        <Grid item>
          <Heatmap
            onClick={reset}
            style={{ ...getSize(), borderRadius: 4 }}
            data={radial[waveform as keyof typeof radial]({ ...options, time })}
            time={time}
            color={colorScales[colorScale as keyof typeof colorScales]}
          />
        </Grid>
        <Grid item>
          <Card className={classes.card}>
            <Picker
              title="Set color scheme: "
              values={Object.keys(colorScales)}
              onChange={setColorScale}
            />
          </Card>
        </Grid>
      </Grid>
      <Slider
        className={classes.slider}
        defaultValue={0}
        getAriaValueText={() => 'zero'}
        valueLabelDisplay="auto"
        step={0.01}
        min={0}
        max={1}
        value={sliderValue}
        onChange={(_, value) => setSliderValue(value as number)}
        onChangeCommitted={(_, value) => setTime(value as number)}
      />
      <button onClick={() => setTime(0)}>Reset</button>
    </Grid>
  )
}

export default App
