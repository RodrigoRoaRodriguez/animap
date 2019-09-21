/* Waveforms */
export type Waveform = (args: {
  periods: number;
  size: number;
  value: number;
}) => number

export const sawtooth: Waveform = ({ periods, size, value }) => (size - Math.abs((value % (size / periods)) - size)) / size

export const sine: Waveform = ({ periods, size, value }) => Math.sin((value / (size - 1)) * Math.PI * 2 * periods)

export const square: Waveform = ({ periods, size, value }) => Math.sin((value / (size - 1)) * Math.PI * 2 * periods) > 0 ? 1 : -1

export const gauss: Waveform = ({ periods, size, value }) => Math.exp(-1 * (value / (2 * (size - 1) ** 2)))

export const triangle: Waveform = ({ periods, size, value }) => 1 - Math.abs((((value * periods * 2) / (size - 1)) % 2) - 1)
