import React, { useState, ReactNode } from 'react'
import { radial } from './2dDataGenerators'

const initialState = {
  waveform: Object.keys(radial)[0],
  setWaveform(_waveform): void {
    throw new Error('Provider not initialized')
  },
}

export const waveformContext = React.createContext(initialState)

export const WaveFormProvider = ({ children }: { children: ReactNode }) => {
  const [value, setState] = useState({
    waveform: initialState.waveform,
    setWaveform: waveform => setState({ ...value, waveform }),
  })

  return <waveformContext.Provider {...{ value, children }} />
}
