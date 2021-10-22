import { useState as useHookstate } from '@hookstate/core'
import { Card, IconButton, Slider } from '@material-ui/core'
import PauseIcon from '@material-ui/icons/Pause'
import PlayArrow from '@material-ui/icons/PlayArrow'
import RefreshIcon from '@material-ui/icons/Refresh'
import * as React from 'react'
import { colorScales } from './colorScales'
import Heatmap from './components/Heatmap'
import { Picker } from './components/Picker'
import { useAnimation } from './hooks/useAnimation'
import { useDux } from './useDux'
import { useStyles } from './useStyles'
import { radial } from './utils/2dDataGenerators'
import { join } from './utils/join'
import { addNoise } from './utils/utils'
// Add empty waveform

const initialState = {
  waveform: Object.keys(radial)[0],
  colorScale: Object.keys(colorScales)[0],
  timeSliderValue: 0,
}

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
  // TODO: Redo this using hookState
  const {
    state: { waveform, colorScale, timeSliderValue },
    setState,
    act,
  } = useDux(initialState, (state) => ({
    printWaveForm: () => alert(state.waveform),
    setWaveform: (waveform: string) => setState({ waveform }),
    sliderChangeCommitted: (_: any, value: number | number[]) =>
      setTimeTo(value as number),
  }))

  const { noiseMagnitude } = useHookstate({
    noiseMagnitude: 0.25,
  })

  const classes = useStyles({})

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
    <div className={classes.root}>
      <main className={classes.main}>
        <Heatmap
          className={classes.heatmap}
          onClick={mainActionProps.onClick}
          data={radial[waveform as keyof typeof radial]({
            transform: addNoise(noiseMagnitude.get()),
            periods: 4,
            size: 100,
            time,
          })}
          time={time}
          color={colorScales[colorScale as keyof typeof colorScales]}
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
            value={noiseMagnitude.get()}
            onChange={(_, value) =>
              typeof value === 'number' && noiseMagnitude.set(value)
            }
            aria-labelledby="noise-magnitude"
            step={0.01}
            max={3}
            valueLabelDisplay="auto"
          />
        </Card>
      </div>
      <div className={classes.controls}>
        <IconButton {...mainActionProps} />
        <Slider
          className={classes.slider}
          defaultValue={0}
          valueLabelDisplay="auto"
          step={0.01}
          max={1}
          value={timeSliderValue}
          onChange={(_, value) =>
            setState({ timeSliderValue: value as number })
          }
          onChangeCommitted={act.sliderChangeCommitted}
        />
      </div>
    </div>
  )
}

export default App
