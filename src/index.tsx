import * as React from 'react'
import { render } from 'react-dom'
import * as d3 from 'd3'
import styled, { createGlobalStyle } from 'styled-components'
import { radial } from './2dDataGenerators'
import Heatmap from './Heatmap'
import { XYMatrix } from './utils'

const GlobalStyles = createGlobalStyle`
  html {
    font-family: 'Helvetica', sans-serif;
    background: #123;
    color: #ccc;
    text-align: center;
  }
  canvas {
    margin: .25em auto;
    display: block;
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

export const PADDING = 20
export const getSize = () => {
  let size = Math.min(window.innerWidth, window.innerHeight) / 2 - PADDING
  return { width: size, height: size }
}

const App = () => (
  <React.Fragment>
    <GlobalStyles />
    <Title>Heatmap</Title>
    <Sub>Keep working to see some magic happen 🌈✨</Sub>
    {[
      radial.triangle(),
      radial.sawtooth(),
      radial.sine(),
      radial.square(),
      // new XYMatrix({ size: 10 }),
      // gaussMatrix(10, 2),
    ].map(data => (
      <Heatmap
        style={{ ...getSize(), borderRadius: 4 }}
        data={data}
        color={d3.interpolateHclLong('#012', '#ff6')}
      />
    ))}
  </React.Fragment>
)

const rootElement = document.getElementById('root')
render(<App />, rootElement)
