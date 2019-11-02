import React, { useState, ReactNode } from 'react'
import { radial } from './2dDataGenerators'

export type ContextType<T> = [T, (_newValue: T) => void]

const initialState: ContextType<string> = [
  'uninitialized',
  function setWaveform(_waveform: string): void {
    throw new Error('Provider not initialized')
  },
]

export const waveformContext = React.createContext(initialState)

export const WaveFormProvider = ({ children }: { children: ReactNode }) => {
  const setWaveform = waveform => setState([waveform, setWaveform])
  const [value, setState] = useState([
    Object.keys(radial)[0],
    setWaveform
  ] as ContextType<string>)

  return <waveformContext.Provider {...{ value, children }} />
}
