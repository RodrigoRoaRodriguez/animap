import { useEffect } from 'react'
import create, { StateSelector } from 'zustand'

interface AnimationState {
  elapsed: number
  start: number
  duration: number
  playing: boolean
  animationFrame: number
  setTimeTo: (percentage: number) => void
  play: () => void
  reset: () => void
  replay: () => void
  pause: () => void
  tick: () => void
  loop: () => void
}

export const useAnimationStore = create<AnimationState>((set, get) => ({
  elapsed: 0,
  start: Date.now(),
  duration: 1000,
  playing: true,
  animationFrame: NaN,
  setTimeTo: (percentage: number) =>
    set(({ duration }) => ({
      start: Date.now() - duration * percentage,
      elapsed: duration * percentage,
    })),
  play: () =>
    set(({ elapsed }) => ({ start: Date.now() - elapsed, playing: true })),
  reset: () => set(() => ({ start: Date.now(), elapsed: 0 })),
  replay: () => set(() => ({ start: Date.now(), elapsed: 0, playing: true })),
  pause: () => set(() => ({ playing: false })),
  tick: () => set((state) => ({ elapsed: Date.now() - state.start })),
  loop: () => {
    if (get().playing)
      set((animation) => {
        if (animation.elapsed > animation.duration)
          return { playing: false, elapsed: animation.duration } as any
        return {
          animationFrame: requestAnimationFrame(animation.loop),
          elapsed: Date.now() - animation.start,
        }
      })
    return () => {
      cancelAnimationFrame(get().animationFrame)
    }
  },
}))

const pickLoop = ({ loop }: AnimationState): (() => void) => loop
const pickPlaying = ({ playing }: AnimationState): boolean => playing
/**
 * Hook to start the animation loop.
 */
export function useAnimationLoop() {
  const loop = useAnimationStore(pickLoop)
  const playing = useAnimationStore(pickPlaying)
  useEffect(loop, [playing, loop])
}
