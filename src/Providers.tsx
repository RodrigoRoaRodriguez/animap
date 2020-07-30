import { createMuiTheme, CssBaseline } from '@material-ui/core'
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
  overrides: {
    MuiFormLabel: { // Name of the component ⚛️ / style sheet
      root: { // Name of the rule
        "&$focused": { // increase the specificity for the pseudo class
          color: "#ffa"
        }
      }
    }
  }
})

const Providers = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <WaveFormProvider>
      <App />
    </WaveFormProvider>
  </ThemeProvider>
)

export default Providers
