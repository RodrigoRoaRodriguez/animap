import PauseIcon from '@mui/icons-material/Pause'
import PlayArrow from '@mui/icons-material/PlayArrow'
import RefreshIcon from '@mui/icons-material/Refresh'
import { Card, FormLabel, IconButton, Slider, styled } from '@mui/material'
import { useCallback, useMemo } from 'react'
import create from 'zustand'
import { useAnimationLoop, useAnimationStore } from '../hooks/useAnimation'
import { radial } from '../utils/2dDataGenerators'
import { colorScales } from '../utils/colorScales'
import { join } from '../utils/join'
import { addNoise } from '../utils/utils'
import Heatmap from './Heatmap'
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
    margin: 'auto',
    gridTemplateAreas: `
    "main"
    "controls"
    "options"
    `,
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: 'auto 1fr',
      gridTemplateAreas: `
      "options main ."
      "controls controls controls"
      `,
    },
    [`& .${classes.card}`]: {
      padding: theme.spacing(2),
      textAlign: 'center',
      margin: `${4}px ${theme.spacing()}`,
    },
    [`& .${classes.options}`]: {
      minWidth: '200px',
      gridArea: 'options',
      [theme.breakpoints.down('md')]: {
        display: 'flex',
        placeItems: 'flex-end',
        placeContent: 'flex-end',
        justifyContent: 'space-between',
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
      height: '100%',
      width: '100%',
      maxWidth: '90vmin',
      borderRadius: 4,
      aspectRatio: '1',
    },
    [`& .${classes.heatmap}`]: {
      placeSelf: 'center',
      height: '100%',
      width: '100%',
      maxHeight: '90vh',
      maxWidth: '90vh',
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

const useAppStore = create<typeof initialState>(() => ({ ...initialState }))

const setWaveform = (waveform: string) => useAppStore.setState({ waveform })
const setColorScale = (colorScale: string) =>
  useAppStore.setState({ colorScale })

const setNoiseMagnitude = (_: unknown, noiseMagnitude: number | unknown) => {
  typeof noiseMagnitude === 'number' && useAppStore.setState({ noiseMagnitude })
}

const App = () => {
  const { showOptions } = useHideOptionsStore()

  const { noiseMagnitude } = useAppStore()

  return (
    <Root>
      <AnimatedHeatmap />
      <div className={classes.options}>
        {showOptions && (
          <>
            <Card className={classes.card}>
              <Picker
                title="Waveform"
                values={Object.keys(radial)}
                onChange={setWaveform}
              />
            </Card>
            <Card className={join(classes.card, classes.options)}>
              <Picker
                title="Color scheme"
                values={Object.keys(colorScales)}
                onChange={setColorScale}
              />
            </Card>
            <Card
              sx={{ overflow: 'visible' }}
              className={join(classes.card, classes.options)}
            >
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
        <HideOptionsButton />
      </div>
      <PlayerControls />
    </Root>
  )
}

export default App

function AnimatedHeatmap() {
  useAnimationLoop()
  const { waveform, colorScale, noiseMagnitude } = useAppStore()
  const timeValues = useMemo(
    () =>
      [...Array(1000).keys()].map((time) =>
        radial[waveform as keyof typeof radial]({
          transform: addNoise(noiseMagnitude),
          periods: 4,
          size: 100,
          time: time / 1000,
        }),
      ),
    [waveform, noiseMagnitude],
  )

  const { mainActionProps, time } = useAnimationControls()

  return (
    <Heatmap
      onClick={mainActionProps.onClick}
      pixelValues={timeValues[Math.floor(time * (timeValues.length - 1))]}
      className={classes.heatmap}
      colorScale={colorScales[colorScale as keyof typeof colorScales]}
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
