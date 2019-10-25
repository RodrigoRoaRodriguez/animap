import { useState, useEffect } from "react";

// Some easing functions copied from:
// https://github.com/streamich/ts-easing/blob/master/src/index.ts
// Hardcode here or pull in a dependency
const easing = {
  linear: n => n,
  elastic: n =>
    n * (33 * n * n * n * n - 106 * n * n * n + 126 * n * n - 67 * n + 15),
  exponential: n => Math.pow(2, 10 * (n - 1))
};

// Hook
export function useAnimation(
  easingName = "linear",
  duration = 1000,
  delay = 0
) {
  const [elapsed, setTime] = useState(0);
  const [start, setStart] = useState(Date.now());

  useEffect(
    animationLoop(start, duration, delay, setTime),
    [start, duration, delay] // Re-run effect when duration or delay change
  );

  // Normalize, so time is on a scale from 0 to 1
  const normalizedTime = Math.min(1, elapsed / duration);

  const reset = () => setStart(Date.now());

  // Return altered value based on our specified easing function
  return [easing[easingName](normalizedTime), reset];
}

function animationLoop(
  start: number,
  duration: number,
  delay: number,
  setTime
) {
  let animationFrame, stopTimer;
  // Function to be executed on each animation frame
  function onFrame() {
    setTime(Date.now() - start);
    loop();
  }

  function loop() {
    animationFrame = requestAnimationFrame(onFrame);
  }
  function onStart() {
    // Set a timeout to stop things when duration time elapses
    stopTimer = setTimeout(() => {
      cancelAnimationFrame(animationFrame);
      setTime(Date.now() - start);
    }, duration);
    loop();
  }

  return () => {
    // Start after specified delay (defaults to 0)
    const timerDelay = setTimeout(onStart, delay);
    // Clean things up
    return () => {
      clearTimeout(stopTimer);
      clearTimeout(timerDelay);
      cancelAnimationFrame(animationFrame);
    };
  };
}
