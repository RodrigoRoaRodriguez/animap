import { useEffect } from 'react'
import { createState, useState } from '@hookstate/core'

export const animationState = createState({
  elapsed: 0,
  start: Date.now(),
  duration: 1000,
  playing: true,
})

const setTimeTo = (percentage: number) =>
  animationState.merge({
    start: Date.now() - animationState.duration.get() * percentage,
    elapsed: animationState.duration.get() * percentage,
  })

export const play = () =>
  animationState.merge({
    start: Date.now() - animationState.elapsed.get(),
    playing: true,
  })

export const reset = () =>
  animationState.merge({ start: Date.now(), elapsed: 0 })

export const pause = () => animationState.merge({ playing: false })

// Hook
export function useAnimation() {
  const state = useState(animationState)

  let animationFrame: number
  // Function to be executed on each animation frame
  function animationLoop() {
    state.batch((state) => {
      if (state.playing.get()) state.elapsed.set(Date.now() - state.start.get())
      if (state.elapsed.get() < state.duration.get())
        animationFrame = requestAnimationFrame(animationLoop)
      else state.playing.set(false)
    })
  }

  useEffect(() => {
    // Set a timeout to stop things when duration time elapses
    if (state.playing.get()) animationLoop()
    // Cleanup: remove listeners when the components is unmounted.
    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [state.playing.get()])

  // Normalize, so time is on a scale from 0 to 1
  const normalizedTime = Math.min(1, state.elapsed.get() / state.duration.get())

  // Return altered value based on our specified easing function
  return [normalizedTime, setTimeTo] as const
}
