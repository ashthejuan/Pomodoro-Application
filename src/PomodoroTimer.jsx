import { useState, useEffect, useRef } from "react";
import "./Timer.css";

const PomodoroTimer = () => {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (Notification.permission === "default"){
        Notification.requestPermission();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatNumber = (num) => String(num).padStart(2, "0");

  const updateTime = (segment, increment) => {
    setTime((prev) => ({
      ...prev,
      [segment]: (prev[segment] + increment + 60) % 60,
    }));
  };

  const getTotalSeconds = () => {
    return time.hours * 3600 + time.minutes * 60 + time.seconds;
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    let totalSeconds = getTotalSeconds();
    if (totalSeconds === 0) return;

    setIsRunning(true);
    setIsPaused(false);

    timerRef.current = setInterval(() => {
      totalSeconds--;

      if (totalSeconds <= 0) {
        clearInterval(timerRef.current);
        alert("Time is up!");
        setIsRunning(false);
        setShowReset(true);
        setTime({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTime({
        hours: Math.floor(totalSeconds / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
      });
    }, 1000);
  };

  const pauseTimer = () => {
    clearInterval(timerRef.current);
    setIsPaused(true);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setIsPaused(false);
    setTime({ hours: 0, minutes: 0, seconds: 0 });
  };

  const resetTimer = () => {
    stopTimer();
    setShowReset(false);
  };

  return (
    <div>
      <h1 className="title">pomodoro timer</h1>
      <div className="timer-container">
        <div className="timer-circle">
          <div className="time-display">
            <button onClick={() => updateTime("hours", 1)}>▲</button>
            <span>{formatNumber(time.hours)}</span>
            <button onClick={() => updateTime("hours", -1)}>▼</button>
            <span>:</span>
            <button onClick={() => updateTime("minutes", 1)}>▲</button>
            <span>{formatNumber(time.minutes)}</span>
            <button onClick={() => updateTime("minutes", -1)}>▼</button>
            <span>:</span>
            <button onClick={() => updateTime("seconds", 1)}>▲</button>
            <span>{formatNumber(time.seconds)}</span>
            <button onClick={() => updateTime("seconds", -1)}>▼</button>
          </div>
          <div className="controls">
            {showReset ? (
              <button className="reset-btn" onClick={resetTimer}>
                Reset Timer
              </button>
            ) : (
              <>
                <button className="ctr-btn" onClick={startTimer} disabled={isRunning && !isPaused}>
                  ▶
                </button>
                <button className="ctr-btn" onClick={pauseTimer} disabled={!isRunning || isPaused}>
                  ⏸
                </button>
                <button className="ctr-btn" onClick={stopTimer} disabled={!isRunning && !isPaused}>
                  ⏹
                </button>
              </>
            )}
          </div>
        </div>
        <footer>made by Akshit Dasgupta</footer>
      </div>
    </div>
  );
};

export default PomodoroTimer;
