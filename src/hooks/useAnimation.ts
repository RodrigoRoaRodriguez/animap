import { useEffect } from 'react'
import { typeActs, useDux } from '../useDux'
import { createState, useState } from '@hookstate/core'

const initialState = {}

type AnimationStore = {
  renderFrame: () => void
} & typeof initialState

export const animationState = createState({
  elapsed: 0,
  start: Date.now(),
  duration: 1000,
  delay: 0,
  playing: true,
})

const renderFrame = () =>
  animationState.elapsed.set(Date.now() - animationState.start.get())

const setTimeTo = (percentage: number) =>
  animationState.start.set(
    Date.now() - animationState.duration.get() * percentage,
  )

const reset = () => animationState.start.set(Date.now())

export const play = () => animationLoop()

// Hook
export function useAnimation() {
  const state = useState(animationState)

  useEffect(
    animationLoop(),
    [], // Re-run effect when duration or delay change
  )

  // Normalize, so time is on a scale from 0 to 1
  const normalizedTime = Math.min(1, state.elapsed.get() / state.duration.get())

  // Return altered value based on our specified easing function
  return [normalizedTime, reset, setTimeTo] as const
}

function animationLoop() {
  // }: Dux<typeof initialState, typeof acts>) {
  let animationFrame: number
  let stopTimer: ReturnType<typeof setTimeout>
  // Function to be executed on each animation frame
  function animationLoop() {
    renderFrame()
    animationFrame = requestAnimationFrame(animationLoop)
  }

  function onStart() {
    // Set a timeout to stop things when duration time elapses
    stopTimer = setTimeout(() => {
      cancelAnimationFrame(animationFrame)
      // renderFrame()
    }, animationState.duration.get())
    animationLoop()
  }

  return () => {
    let timerDelay: ReturnType<typeof setTimeout>
    // Start after specified delay (defaults to 0)
    if (animationState.playing.get())
      timerDelay = setTimeout(onStart, animationState.delay.get())
    // Cleanup: remove listeners when the components is unmounted.
    return () => {
      clearTimeout(stopTimer)
      clearTimeout(timerDelay)
      cancelAnimationFrame(animationFrame)
    }
  }
}
