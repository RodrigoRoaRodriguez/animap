import { makeStyles } from '@material-ui/core'

const PADDING = 0.2

export const getSize = () => {
  let size = Math.min(window.innerWidth, window.innerHeight) / (1.5 + PADDING)
  return { width: size, height: size }
}

export const useStyles = makeStyles((theme) => ({
  root: {
    display: 'grid',
    flexGrow: 1,
    gridTemplateColumns: 'auto auto auto',
    gridTemplateAreas: '"waveforms main colorScales"',
    margin: 'auto',
  },
  card: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  waveforms: {
    gridArea: 'waveforms',
  },
  colorScales: {
    gridArea: 'colorScales',
  },
  main: {
    gridArea: 'main',
  },
  heatmap: {
    height: '90vmin',
    width: '90vmin',
    borderRadius: 4,
    aspectRatio: '1',
  },
  slider: {
    width: getSize().width,
    gridArea: 'colorScale',
  },
}))
