import { createTheme, CssBaseline, Theme } from '@mui/material'
import { red } from '@mui/material/colors'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import App from '../App'

const theme = createTheme({ palette: { mode: 'dark' } })

const Providers = () => (
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StyledEngineProvider>
)

export default Providers
