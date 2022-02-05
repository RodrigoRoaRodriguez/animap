import { createTheme, CssBaseline, Theme } from '@mui/material'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import App from '../app/App'

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
