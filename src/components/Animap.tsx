import BookIcon from '@mui/icons-material/Book'
import GitHubIcon from '@mui/icons-material/GitHub'
import PauseIcon from '@mui/icons-material/Pause'
import PlayArrow from '@mui/icons-material/PlayArrow'
import RefreshIcon from '@mui/icons-material/Refresh'
import {
  Button,
  Card,
  FormLabel,
  IconButton,
  Slider,
  styled,
} from '@mui/material'
import { useCallback } from 'react'
import create from 'zustand'
import { ReactComponent as Logo } from '../assets/animap-logo.svg'
import { useAnimationLoop, useAnimationStore } from '../hooks/useAnimation'
import { toColorInterpolator } from '../hooks/useValueToColor'
import { radialWaveform } from '../utils/2dDataGenerators'
import { map2d } from '../utils/array'
import { colorScales } from '../utils/colorScales'
import Texture from '../utils/Texture'
import { addNoise } from '../utils/utils'
import * as waveforms from '../utils/Waveform'
import { HideOptionsButton, useHideOptionsStore } from './HideOptionsButton'
import { Picker } from './Picker'

const PREFIX = 'App'

const classes = {
  card: `${PREFIX}-card`,
  options: `${PREFIX}-options`,
  main: `${PREFIX}-main`,
  controls: `${PREFIX}-controls`,
  heatmap: `${PREFIX}-heatmap`,
}

// todo remove transition from the slider
const Root = styled('div')(({ theme }) => {
  return {
    display: 'grid',
    maxWidth: 'calc(95vmin + 200px)',
    margin: 'auto',
    gridTemplateAreas: `
    "main"
    "controls"
    "options"
    `,
    [theme.breakpoints.up('lg')]: {
      gridTemplateColumns: '1fr auto',
      gridTemplateAreas: `
      "options main ."
      "controls controls controls"
      `,
    },
    [`& .${classes.card}`]: {
      padding: theme.spacing(),
      textAlign: 'center',
      margin: 0,
    },
    [`& .${classes.options}`]: {
      display: 'grid',
      padding: theme.spacing(),
      gap: theme.spacing(),
      gridArea: 'options',
      alignItems: 'start',
      alignContent: 'flex-start',
      [theme.breakpoints.up('lg')]: {
        maxWidth: '250px',
      },
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
      placeSelf: 'center',
      height: '95vmin',
      width: '95vmin',
      borderRadius: 4,
      aspectRatio: '1',
    },
  }
})
const getSize = () => {
  let size = 0.95 * Math.min(window.innerWidth, window.innerHeight)
  return { width: size, height: size }
}

const initialState = {
  waveform: Object.keys(waveforms)[0],
  colorScale: Object.keys(colorScales)[0],
  timeSliderValue: 0,
  noiseMagnitude: 0.25,
}

const useAppStore = create<typeof initialState>(() => ({ ...initialState }))

const setWaveform = (waveform: string) => useAppStore.setState({ waveform })
const setColorScale = (colorScale: string) =>
  useAppStore.setState({ colorScale })

const setNoiseMagnitude = (_: unknown, noiseMagnitude: number | unknown) => {
  typeof noiseMagnitude === 'number' && useAppStore.setState({ noiseMagnitude })
}

const App = () => {
  const { showOptions } = useHideOptionsStore()
  const { noiseMagnitude, colorScale, waveform } = useAppStore()

  return (
    <Root>
      <AnimatedHeatmap />
      <div className={classes.options}>
        <Card className={classes.card}>
          <Logo />
        </Card>
        <Button
          variant="outlined"
          sx={{ margin: '0' }}
          href="/blog"
          startIcon={<BookIcon />}
        >
          Blog
        </Button>
        <Button
          variant="outlined"
          sx={{ margin: '0' }}
          startIcon={<GitHubIcon />}
          href="https://github.com/RodrigoRoaRodriguez/animap"
        >
          GitHub
        </Button>
        <HideOptionsButton />
        {showOptions && (
          <>
            <Card className={classes.card}>
              <Picker
                title="Waveform"
                values={Object.keys(waveforms)}
                onChange={setWaveform}
                value={waveform}
              />
            </Card>
            <Card className={classes.card}>
              <Picker
                title="Color scheme"
                values={Object.keys(colorScales)}
                onChange={setColorScale}
                value={colorScale}
              />
            </Card>
            <Card sx={{ overflow: 'visible' }} className={classes.card}>
              <FormLabel component="legend">Noise</FormLabel>
              <Slider
                value={noiseMagnitude}
                onChange={setNoiseMagnitude}
                aria-labelledby="noise-magnitude"
                step={0.01}
                max={10}
                valueLabelDisplay="auto"
              />
            </Card>
          </>
        )}
      </div>
      <PlayerControls />
    </Root>
  )
}

export default App

function AnimatedHeatmap() {
  useAnimationLoop()
  const { waveform, colorScale, noiseMagnitude } = useAppStore()
  const { mainActionProps, time } = useAnimationControls()

  return (
    <Texture
      pixels={map2d(
        radialWaveform(waveforms[waveform as keyof typeof waveforms])({
          transform: addNoise(noiseMagnitude),
          periods: 4,
          size: 100,
          time,
        }),
        toColorInterpolator(
          colorScales[colorScale as keyof typeof colorScales],
        ),
      )}
      onClick={mainActionProps.onClick}
      className={classes.heatmap}
      {...getSize()}
    />
  )
}

const PlayerControls = () => {
  const { setTimeTo } = useAnimationStore(({ setTimeTo }) => ({ setTimeTo }))
  const { mainActionProps, time } = useAnimationControls()
  const setTime = useCallback(
    ({}, value: number | number[]) => setTimeTo(value as number),
    [setTimeTo],
  )
  return (
    <div className={classes.controls}>
      <IconButton {...mainActionProps} size="large" />
      <Slider
        defaultValue={0}
        valueLabelDisplay="auto"
        step={0.01}
        sx={{
          '& .MuiSlider-track, & .MuiSlider-track, & .MuiSlider-mark, , & .MuiSlider-thumb':
            {
              transition: 'none',
            },
        }}
        max={1}
        value={time}
        onChange={setTime}
        onChangeCommitted={setTime}
      />
    </div>
  )
}

function useAnimationControls() {
  const { duration, elapsed, pause, play, playing, replay } = useAnimationStore(
    ({ duration, elapsed, pause, play, playing, replay }) => ({
      duration,
      elapsed,
      pause,
      play,
      playing,
      replay,
    }),
  )
  // Normalize, so time is on a scale from 0 to 1
  const time = Math.min(1, elapsed / duration)
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

  return { mainActionProps, time }
}
