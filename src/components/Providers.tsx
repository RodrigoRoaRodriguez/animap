import { createTheme, CssBaseline } from '@mui/material'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import { Pages } from './Pages'

const theme = createTheme({ palette: { mode: 'dark' } })

const Providers = () => (
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Pages />
    </ThemeProvider>
  </StyledEngineProvider>
)

export default Providers
