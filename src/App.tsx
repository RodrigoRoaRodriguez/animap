import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import * as d3 from 'd3'
import * as React from 'react'
import { useContext } from 'react'
import styled from 'styled-components'
import { radial } from './2dDataGenerators'
import { GlobalStyles } from './GlobalStyles'
import Heatmap from './Heatmap'
import { useAnimation } from './hooks/useAnimation'
import { waveformContext } from './waveformContext'

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
  let size = Math.min(window.innerWidth, window.innerHeight) / (2 + PADDING)
  return { width: size, height: size }
}

const options = {
  // transform: addNoise(0.5),
  // periods: 2,
  size: 200,
}

// const datasets = [
//   radial.triangle({...options, time: 0}),
//   radial.sawtooth({...options, time: 0}),
// ]

function Picker() {
  const { waveform, setWaveform } = useContext(waveformContext)
  const onChange = event => setWaveform(event.target.value)

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Waveform: {waveform}</FormLabel>
      <RadioGroup
        defaultValue={Object.keys(radial)[0]}
        aria-label="waveform"
        name="customized-radios"
        onChange={onChange}
      >
        {Object.keys(radial).map(waveform => (
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

const App = () => {
  const { waveform } = useContext(waveformContext)
  const [time, reset] = useAnimation({ deps:([waveform])})
  return (
    <>
      <GlobalStyles />
      <Title>Heatmap {waveform}</Title>
      <Sub>Keep working to see some magic happen 🌈✨</Sub>
      <h2>time: {Math.round(time * 100)}%</h2>
      <Picker />
      <Heatmap
        onClick={reset}
        style={{ ...getSize(), borderRadius: 4 }}
        data={radial[waveform]({ ...options, time })}
        time={time}
        color={d3.interpolateHclLong('#012', '#ff6')}
      />
    </>
  )
}

export default App
