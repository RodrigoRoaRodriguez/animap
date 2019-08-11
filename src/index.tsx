import * as React from 'react'
import { render } from 'react-dom'
import * as d3 from 'd3'
import styled, { createGlobalStyle } from 'styled-components'
import { radial } from './2dDataGenerators'
import { addNoise } from './utils'
import Heatmap from './Heatmap'
import { useAnimation } from './useAnimation'

const GlobalStyles = createGlobalStyle`
  html {
    font-family: 'Helvetica', sans-serif;
    background: #123;
    color: #ccc;
    text-align: center;
  }
  canvas {
    margin: 1vw;
  }
`

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
  size: 200
}

// const datasets = [
//   radial.triangle({...options, time: 0}),
//   radial.sawtooth({...options, time: 0}),
// ]

const App = () => {
  const time = useAnimation('linear', 5000, 0);
  console.log(getSize())
  // const data = radial.sawtooth({ ...options, time })
  return (
    <React.Fragment>
      <GlobalStyles />
      <Title>Heatmap t = {time} </Title>
      <Sub>Keep working to see some magic happen 🌈✨</Sub>
      <Heatmap
        style={{ ...getSize(), borderRadius: 4 }}
        data={radial.triangle({...options, time})}
        color={d3.interpolateHclLong('#012', '#ff6')}
      />
      <Heatmap
        style={{ ...getSize(), borderRadius: 4 }}
        data={radial.sawtooth({...options, time})}
        color={d3.interpolateHclLong('#012', '#ff6')}
      />
    </React.Fragment>
  )
}

const rootElement = document.getElementById('root')
render(<App />, rootElement)
