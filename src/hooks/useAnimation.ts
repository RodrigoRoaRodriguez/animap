import { useEffect } from 'react'
import { typeActs, useDux } from '../useDux'
// import { Acts, useDux } from '../useDux'

export const initialState = {
  elapsed: 0,
  start: Date.now(),
  duration: 1000,
  delay: 0,
  playing: true,
}

const acts = typeActs(initialState, ({ start }, setState) => ({
  renderFrame: () => setState({ elapsed: Date.now() - start }),
}))

// Hook
export function useAnimation({
  duration = 1000,
  delay = 0,
  deps = [] as any[],
} = {}) {
  const dux = useDux({ ...initialState, duration, delay }, acts)

  const {
    state: { start, elapsed },
    setState,
  } = dux

  const reset = () => setState({ start: Date.now() })
  // Reset when dependencies change
  useEffect(reset, deps)

  useEffect(
    animationLoop(dux),
    [start, duration, delay], // Re-run effect when duration or delay change
  )

  // Normalize, so time is on a scale from 0 to 1
  const normalizedTime = Math.min(1, elapsed / duration)

  const setTimeTo = (percentage: number) =>
    setState({ start: Date.now() - duration * percentage })
  // Return altered value based on our specified easing function
  return [normalizedTime, reset, setTimeTo] as const
}

function animationLoop({
  state: { elapsed, duration, delay, playing },
  setState,
  act: { renderFrame },
}: any) {
  // }: Dux<typeof initialState, typeof acts>) {
  let animationFrame: number
  let stopTimer: number
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
    }, duration)
    animationLoop()
  }

  return () => {
    let timerDelay: number
    // Start after specified delay (defaults to 0)
    if (playing) timerDelay = setTimeout(onStart, delay)
    // Cleanup: remove listeners when the components is unmounted.
    return () => {
      clearTimeout(stopTimer)
      clearTimeout(timerDelay)
      cancelAnimationFrame(animationFrame)
    }
  }
}
