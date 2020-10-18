import { useEffect } from 'react'
import { useDux } from '../useDux'

export const initialState = {
  elapsed: 0,
  start: Date.now(),
  duration: 1000,
  delay: 0,
}

// Hook
export function useAnimation({
  duration = 1000,
  delay = 0,
  deps = [] as any[],
} = {}) {
  const { state, setState } = useDux(initialState)
  const { start, elapsed } = state

  const reset = () => setState({ start: Date.now() })
  // Reset when dependencies change
  useEffect(reset, deps)

  useEffect(
    animationLoop(state, setState),
    [start, duration, delay], // Re-run effect when duration or delay change
  )

  // Normalize, so time is on a scale from 0 to 1
  const normalizedTime = Math.min(1, elapsed / duration)

  const setTimeTo = (percentage: number) =>
    setState({ start: Date.now() - duration * percentage })
  // Return altered value based on our specified easing function
  return [normalizedTime, reset, setTimeTo] as const
}

function animationLoop(
  { start, duration, delay, elapsed }: typeof initialState,
  setState: React.Dispatch<Partial<typeof initialState>>,
) {
  let animationFrame: number
  let stopTimer: number
  // Function to be executed on each animation frame
  function onFrame() {
    setState({ elapsed: Date.now() - start })
    loop()
  }

  function loop() {
    animationFrame = requestAnimationFrame(onFrame)
  }

  function onStart() {
    // Set a timeout to stop things when duration time elapses
    stopTimer = setTimeout(() => {
      cancelAnimationFrame(animationFrame)
      setState({ elapsed: Date.now() - start })
    }, duration)
    loop()
  }

  return () => {
    // Start after specified delay (defaults to 0)
    const timerDelay = setTimeout(onStart, delay)
    // Cleanup: remove listeners when the components is unmounted.
    return () => {
      clearTimeout(stopTimer)
      clearTimeout(timerDelay)
      cancelAnimationFrame(animationFrame)
    }
  }
}
