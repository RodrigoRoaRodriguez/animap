import { createMuiTheme } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import React from 'react'
import { WaveFormProvider } from './waveformContext'
import App from './App'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    background: {
      default: '#22222a',
    },
  },
})

const Providers = () => (
  <ThemeProvider theme={theme}>
    <WaveFormProvider>
      <App />
    </WaveFormProvider>
  </ThemeProvider>
)

export default Providers
