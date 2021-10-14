import { createState, useState } from '@hookstate/core'
import { useCallback, useEffect } from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import create from 'zustand'

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

export const useAnimationStore = create<AnimationState>((set) => ({
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
  loop: () =>
    set((state) => {
      if (state.playing) return { elapsed: Date.now() - state.start } as any
      if (state.elapsed < state.duration)
        return { animationFrame: requestAnimationFrame(state.loop) }
      else return { playing: false }
    }),
}))

// Hook
export function useAnimation() {
  const animation = useAnimationStore()
  useEffect(() => {
    // Set a timeout to stop things when duration time elapses
    if (animation.playing) animation.loop()
    // Cleanup: remove listeners when the components is unmounted.
    return () => {
      cancelAnimationFrame(animation.animationFrame)
    }
  }, [animation.playing, animation.loop, animation])

  // Return altered value based on our specified easing function
  return animation
}
