import { createMuiTheme, CssBaseline } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import React from 'react'
import App from './App'
import red from '@material-ui/core/colors/red'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: red,
    secondary: red,
    background: {
      default: '#22222a',
    },
  },
  overrides: {
    MuiFormLabel: {
      // Name of the component ⚛️ / style sheet
      root: {
        // Name of the rule
        '&$focused': {
          // increase the specificity for the pseudo class
          color: '#ffa',
        },
      },
    },
  },
})

const Providers = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
)

export default Providers
