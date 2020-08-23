import { useState, useEffect } from 'react'

// Hook
export function useAnimation({
  duration = 1000,
  delay = 0,
  deps = [] as any[],
} = {}) {
  const [elapsed, setTime] = useState(0)
  const [start, setStart] = useState(Date.now())

  const reset = () => setStart(Date.now())
  // Reset when dependencies change
  useEffect(reset, deps)

  useEffect(
    animationLoop(start, duration, delay, setTime),
    [start, duration, delay], // Re-run effect when duration or delay change
  )

  // Normalize, so time is on a scale from 0 to 1
  const normalizedTime = Math.min(1, elapsed / duration)

  const setTimeTo = (percentage: number) =>
    setStart(Date.now() - duration * percentage)
  // Return altered value based on our specified easing function
  return [normalizedTime, reset, setTimeTo] as const
}

function animationLoop(
  start: number,
  duration: number,
  delay: number,
  setTime: (time: number) => void,
) {
  let animationFrame: number
  let stopTimer: number
  // Function to be executed on each animation frame
  function onFrame() {
    setTime(Date.now() - start)
    loop()
  }

  function loop() {
    animationFrame = requestAnimationFrame(onFrame)
  }

  function onStart() {
    // Set a timeout to stop things when duration time elapses
    stopTimer = setTimeout(() => {
      cancelAnimationFrame(animationFrame)
      setTime(Date.now() - start)
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
