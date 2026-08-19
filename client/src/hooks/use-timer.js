import { useState, useEffect, useRef, useCallback } from "react";
function useTimer({ duration, onComplete, onTick }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(duration);
  const start = useCallback(() => {
    if (!isActive) {
      setIsActive(true);
      startTimeRef.current = Date.now();
    }
  }, [isActive]);
  const pause = useCallback(() => {
    if (isActive) {
      setIsActive(false);
      pausedTimeRef.current = timeLeft;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isActive, timeLeft]);
  const reset = useCallback(() => {
    setIsActive(false);
    setTimeLeft(duration);
    pausedTimeRef.current = duration;
    startTimeRef.current = null;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [duration]);
  const skip = useCallback(() => {
    setTimeLeft(0);
    setIsActive(false);
    onComplete?.();
  }, [onComplete]);
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - (startTimeRef.current || now)) / 1e3);
        const newTimeLeft = Math.max(0, pausedTimeRef.current - elapsed);
        setTimeLeft(newTimeLeft);
        onTick?.(newTimeLeft);
        if (newTimeLeft === 0) {
          setIsActive(false);
          onComplete?.();
        }
      }, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, onComplete, onTick]);
  useEffect(() => {
    setTimeLeft(duration);
    pausedTimeRef.current = duration;
    if (!isActive) {
      startTimeRef.current = null;
    }
  }, [duration, isActive]);
  const progress = 1 - timeLeft / duration;
  return {
    timeLeft,
    isActive,
    progress,
    start,
    pause,
    reset,
    skip,
    toggle: isActive ? pause : start
  };
}
function useStopwatch() {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [laps, setLaps] = useState([]);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(0);
  const start = useCallback(() => {
    if (!isActive) {
      setIsActive(true);
      startTimeRef.current = Date.now();
    }
  }, [isActive]);
  const pause = useCallback(() => {
    if (isActive) {
      setIsActive(false);
      pausedTimeRef.current = time;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isActive, time]);
  const reset = useCallback(() => {
    setIsActive(false);
    setTime(0);
    setLaps([]);
    pausedTimeRef.current = 0;
    startTimeRef.current = null;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  const lap = useCallback(() => {
    if (isActive && time > 0) {
      const previousLapTime = laps.length > 0 ? laps[laps.length - 1].time : 0;
      const lapTime = time - previousLapTime;
      setLaps((prev) => [...prev, { time, lapTime }]);
    }
  }, [isActive, time, laps]);
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - (startTimeRef.current || now)) / 10);
        setTime(pausedTimeRef.current + elapsed);
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);
  return {
    time,
    isActive,
    laps,
    start,
    pause,
    reset,
    lap,
    toggle: isActive ? pause : start
  };
}
export {
  useStopwatch,
  useTimer
};
