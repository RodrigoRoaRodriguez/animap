import { createMuiTheme } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import React, { ReactNode } from 'react'
import { WaveFormProvider } from './waveformContext'
import App from './App'


const theme = createMuiTheme({ palette: { type: 'dark' } })
const Providers = () => (
  <ThemeProvider theme={theme}>
    <WaveFormProvider> 
      <App /> 
      </WaveFormProvider>
  </ThemeProvider>
)

export default Providers
