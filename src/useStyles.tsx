import { makeStyles } from '@material-ui/core'

const PADDING = 0.2

export const getSize = () => {
  let size = Math.min(window.innerWidth, window.innerHeight) / (1.5 + PADDING)
  return { width: size, height: size }
}

export const useStyles = makeStyles((theme) => ({
  root: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    gridTemplateAreas: `
    "options main ."
    "controls controls controls"
    `,
    margin: 'auto',
  },
  card: {
    padding: theme.spacing(2),
    textAlign: 'center',
    margin: `${4}px ${theme.spacing()}px`,
  },
  options: {
    gridArea: 'options',
  },
  main: {
    gridArea: 'main',
  },
  controls: {
    gridArea: 'controls',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    paddingRight: `${theme.spacing(2)}px`,
    gap: `${theme.spacing()}px`,
    alignItems: 'center',
    '& canvas': {
      display: 'block',
    },
  },
  heatmap: {
    height: '90vmin',
    maxWidth: '90vmin',
    borderRadius: 4,
    aspectRatio: '1',
  },
  slider: {
    // gridArea: 'colorScale',
  },
}))
