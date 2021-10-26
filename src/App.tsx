import PauseIcon from '@mui/icons-material/Pause'
import PlayArrow from '@mui/icons-material/PlayArrow'
import RefreshIcon from '@mui/icons-material/Refresh'
import { Card, IconButton, Slider } from '@mui/material'
import { styled } from '@mui/material/styles'
import * as React from 'react'
import { useState } from 'react'
import create, { SetState } from 'zustand'
import { AnimatedHeatmap } from './AnimatedHeatmap'
import { colorScales } from './colorScales'
import Heatmap from './components/Heatmap'
import { Picker } from './components/Picker'
import { useAnimation } from './hooks/useAnimation'
import { radial } from './utils/2dDataGenerators'
import { join } from './utils/join'
import { addNoise } from './utils/utils'

const PREFIX = 'App'

const classes = {
  root: `${PREFIX}-root`,
  card: `${PREFIX}-card`,
  options: `${PREFIX}-options`,
  main: `${PREFIX}-main`,
  controls: `${PREFIX}-controls`,
  heatmap: `${PREFIX}-heatmap`,
}

const Root = styled('div')(({ theme }) => {
  return {
    [`&.${classes.root}`]: {
      display: 'grid',
      margin: 'auto',
      gridTemplateAreas: `
    "main"
    "controls"
    "options"
    `,
      [theme.breakpoints.up('md')]: {
        gridTemplateColumns: '1fr auto 1fr',
        gridTemplateAreas: `
      "options main ."
      "controls controls controls"
      `,
      },
    },
    [`& .${classes.card}`]: {
      padding: theme.spacing(2),
      textAlign: 'center',
      margin: `${4}px ${theme.spacing()}`,
    },
    [`& .${classes.options}`]: {
      gridArea: 'options',
      [theme.breakpoints.down('md')]: {
        display: 'flex',
        placeItems: 'flex-end',
        placeContent: 'flex-end',
        justifyContent: 'space-between',
      },
    },
    [`& .${classes.main}`]: {
      gridArea: 'main',
      display: 'grid',
      justifyContent: 'center',
    },
    [`& .${classes.controls}`]: {
      gridArea: 'controls',
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      paddingRight: theme.spacing(2),
      gap: theme.spacing(),
      alignItems: 'center',
      '& canvas': {
        display: 'block',
      },
    },
    [`& .${classes.heatmap}`]: {
      height: '90vmin',
      maxWidth: '90vmin',
      borderRadius: 4,
      aspectRatio: '1',
    },
  }
})

const PADDING = 0.2

export const getSize = () => {
  let size = Math.min(window.innerWidth, window.innerHeight) / (1.5 + PADDING)
  return { width: size, height: size }
}

// Add empty waveform

const initialState = {
  waveform: Object.keys(radial)[0],
  colorScale: Object.keys(colorScales)[0],
  timeSliderValue: 0,
  noiseMagnitude: 0.25,
}

interface Actions {
  setState: SetState<typeof initialState & Actions>
}

const useAppStore = create<typeof initialState & Actions>((set) => ({
  ...initialState,
  setState: set,
}))

const App = () => {
  const { duration, elapsed, pause, play, playing, replay, setTimeTo } =
    useAnimation(
      ({ duration, elapsed, pause, play, playing, replay, setTimeTo }) => ({
        duration,
        elapsed,
        pause,
        play,
        playing,
        replay,
        setTimeTo,
      }),
    )
  // Normalize, so time is on a scale from 0 to 1
  const time = Math.min(1, elapsed / duration)

  const { waveform, colorScale, timeSliderValue, setState } = useAppStore()

  const [noiseMagnitude, setNoiseMagnitude] = useState(0.25)

  React.useEffect(() => {
    setState({ timeSliderValue: time })
  }, [time, setState])

  let mainActionProps = {
    'aria-label': 'play',
    onClick: play,
    children: <PlayArrow />,
  }

  if (playing)
    mainActionProps = {
      'aria-label': 'pause',
      onClick: pause,
      children: <PauseIcon />,
    }

  if (time >= 1)
    mainActionProps = {
      'aria-label': 'replay',
      onClick: replay,
      children: <RefreshIcon />,
    }

  return (
    <Root className={classes.root}>
      <main className={classes.main}>
        <AnimatedHeatmap
          {...{
            onClick: mainActionProps.onClick,
            waveform,
            noiseMagnitude,
            time,
            colorScale,
          }}
        />
      </main>
      <div className={classes.options}>
        <Card className={classes.card}>
          <Picker
            title="Waveform: "
            values={Object.keys(radial)}
            onChange={(waveform) => setState({ waveform })}
          />
        </Card>
        <Card className={join(classes.card, classes.options)}>
          <Picker
            title="Set color scheme: "
            values={Object.keys(colorScales)}
            onChange={(colorScale) => setState({ colorScale })}
          />
        </Card>
        <Card className={join(classes.card, classes.options)}>
          <Picker
            title="Noise: "
            values={[]}
            onChange={(colorScale) => setState({ colorScale })}
          />
          <Slider
            value={noiseMagnitude}
            onChange={(_, value) =>
              typeof value === 'number' && setNoiseMagnitude(value)
            }
            aria-labelledby="noise-magnitude"
            step={0.01}
            max={3}
            valueLabelDisplay="auto"
          />
        </Card>
      </div>
      <div className={classes.controls}>
        <IconButton {...mainActionProps} size="large" />
        <Slider
          defaultValue={0}
          valueLabelDisplay="auto"
          step={0.01}
          max={1}
          value={timeSliderValue}
          onChange={(_, value) =>
            setState({ timeSliderValue: value as number })
          }
          onChangeCommitted={(_: any, value: number | number[]) =>
            setTimeTo(value as number)
          }
        />
      </div>
    </Root>
  )
}

export default App
