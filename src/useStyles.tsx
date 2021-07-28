import { makeStyles } from '@material-ui/core'

const PADDING = 0.2

export const getSize = () => {
  let size = Math.min(window.innerWidth, window.innerHeight) / (1.5 + PADDING)
  return { width: size, height: size }
}

export const useStyles = makeStyles((theme) => ({
  root: {
    display: 'grid',
    gridTemplateColumns: 'auto auto',
    gridTemplateAreas: `
    "options main"
    ". controls"
    `,
    margin: 'auto',
  },
  card: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  options: {
    gridArea: 'options',
  },
  main: {
    gridArea: 'main',
  },
  controls: {
    gridArea: 'controls',
  },
  heatmap: {
    height: '90vmin',
    maxWidth: '90vmin',
    borderRadius: 4,
    aspectRatio: '1',
  },
  slider: {
    width: getSize().width,
    gridArea: 'colorScale',
  },
}))
