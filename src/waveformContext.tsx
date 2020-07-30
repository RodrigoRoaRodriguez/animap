import React, { useState, FC } from 'react'
import { radial } from './2dDataGenerators'

export type ContextType<T> = [T, (_newValue: T) => void]

const [initialState] = Object.keys(radial)

export const waveformContext = React.createContext([
  initialState,
  function setWaveform(_waveform: string): void {
    throw new Error('Provider not initialized')
  },
] as const)

export const WaveFormProvider: FC = ({ children }) => {
  return <waveformContext.Provider value={useState(initialState)} {...{ children }} />
}
