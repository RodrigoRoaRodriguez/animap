import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import * as d3 from 'd3'
import * as React from 'react'
import { useContext, useState } from 'react'
import styled from 'styled-components'
import { radial } from './2dDataGenerators'
import Heatmap from './Heatmap'
import { useAnimation } from './hooks/useAnimation'
import { waveformContext } from './waveformContext'
import CssBaseline from '@material-ui/core/CssBaseline'
import { Card, Grid, makeStyles } from '@material-ui/core'

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

// const datasets = [
//   radial.triangle({...options, time: 0}),
//   radial.sawtooth({...options, time: 0}),
// ]

function Picker({ values, onChange }) {
  const forwardValue = event => onChange(event.target.value)
  return (
    <FormControl component="fieldset">
      <CssBaseline />
      <FormLabel component="legend">Waveform: </FormLabel>
      <RadioGroup defaultValue={values[0]} onChange={forwardValue}>
        {values.map(waveform => (
          <FormControlLabel
            value={waveform}
            control={<Radio />}
            label={waveform}
          />
        ))}
      </RadioGroup>
    </FormControl>
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  card: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
}))

const App = () => {
  // const [ waveform, setWaveform ] = useContext(waveformContext)
  const [waveform, setWaveform] = useState(Object.keys(radial)[0])
  const [time, reset] = useAnimation({ deps: [waveform] })
  const classes = useStyles()
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
        <Grid item>
          <Card className={classes.card}>
            <Picker values={Object.keys(radial)} onChange={setWaveform} />
          </Card>
        </Grid>
        <Grid item>
          <Heatmap
            onClick={reset}
            style={{ ...getSize(), borderRadius: 4 }}
            data={radial[waveform]({ ...options, time })}
            time={time}
            color={d3.interpolateHclLong('#012', '#ff6')}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default App
