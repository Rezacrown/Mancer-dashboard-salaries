"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Interface untuk countdown options
 */
interface CountdownOptions {
  autoStart?: boolean;
  onComplete?: () => void;
  onTick?: (timeLeft: number) => void;
  interval?: number; // dalam milidetik
}

/**
 * Interface untuk countdown result
 */
interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  totalSeconds: number;
  totalMilliseconds: number;
  isRunning: boolean;
  isCompleted: boolean;
  formatted: string;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  restart: (newDuration?: number) => void;
  addTime: (milliseconds: number) => void;
  subtractTime: (milliseconds: number) => void;
}

/**
 * Hook untuk countdown timer
 * @param {number} duration - Durasi countdown dalam milidetik
 * @param {CountdownOptions} [options] - Opsi untuk countdown
 * @returns {CountdownResult} Objek yang berisi fungsi dan state untuk countdown
 *
 * @example
 * const {
 *   days, hours, minutes, seconds,
 *   isRunning, isCompleted,
 *   start, pause, resume, reset, restart
 * } = useCountdown(60000, { autoStart: true }); // 60 detik countdown
 *
 * // Countdown dengan callback
 * const countdown = useCountdown(30000, {
 *   onComplete: () => console.log("Countdown selesai!"),
 *   onTick: (timeLeft) => console.log(`Sisa waktu: ${timeLeft}ms`)
 * });
 */
export const useCountdown = (
  duration: number,
  options: CountdownOptions = {}
): CountdownResult => {
  const {
    autoStart = false,
    onComplete,
    onTick,
    interval = 100, // Update setiap 100ms
  } = options;

  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [isRunning, setIsRunning] = useState<boolean>(autoStart);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [pausedTime, setPausedTime] = useState<number | null>(null);
  const [totalElapsed, setTotalElapsed] = useState<number>(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateTimeRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);
  const onTickRef = useRef(onTick);

  // Update refs when callbacks change
  useEffect(() => {
    onCompleteRef.current = onComplete;
    onTickRef.current = onTick;
  }, [onComplete, onTick]);

  // Hitung waktu yang tersisa
  const calculateTimeLeft = useCallback(() => {
    if (!startTime) return duration;

    const now = Date.now();
    const elapsed =
      totalElapsed + (pausedTime ? pausedTime - startTime : now - startTime);

    return Math.max(0, duration - elapsed);
  }, [duration, startTime, pausedTime, totalElapsed]);

  // Format waktu menjadi d:h:m:s:ms
  const formatTime = useCallback((milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const ms = milliseconds % 1000;

    return {
      days,
      hours,
      minutes,
      seconds,
      milliseconds: ms,
      totalSeconds,
      totalMilliseconds: milliseconds,
      isCompleted: milliseconds <= 0,
      formatted: `${days}d ${hours}h ${minutes}m ${seconds}s ${ms}ms`,
    };
  }, []);

  // Update countdown
  const updateCountdown = useCallback(() => {
    const currentTimeLeft = calculateTimeLeft();
    setTimeLeft(currentTimeLeft);

    // Trigger tick callback
    if (onTickRef.current) {
      onTickRef.current(currentTimeLeft);
    }

    // Check if countdown is completed
    if (currentTimeLeft <= 0) {
      setIsRunning(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
    }
  }, [calculateTimeLeft]);

  // Setup interval
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(updateCountdown, interval);
      lastUpdateTimeRef.current = Date.now();
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, updateCountdown, interval]);

  // Handle pause
  useEffect(() => {
    if (!isRunning && startTime && !pausedTime) {
      setPausedTime(Date.now());
    }
  }, [isRunning, startTime, pausedTime]);

  // Mulai countdown
  const start = useCallback(() => {
    if (!isRunning && timeLeft > 0) {
      const now = Date.now();
      setStartTime(now);
      setPausedTime(null);
      setIsRunning(true);
    }
  }, [isRunning, timeLeft]);

  // Pause countdown
  const pause = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      if (startTime && !pausedTime) {
        setPausedTime(Date.now());
        setTotalElapsed((prev) => prev + (Date.now() - startTime));
      }
    }
  }, [isRunning, startTime, pausedTime]);

  // Resume countdown
  const resume = useCallback(() => {
    if (!isRunning && pausedTime && timeLeft > 0) {
      setStartTime(Date.now());
      setPausedTime(null);
      setIsRunning(true);
    }
  }, [isRunning, pausedTime, timeLeft]);

  // Reset countdown
  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(duration);
    setStartTime(null);
    setPausedTime(null);
    setTotalElapsed(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [duration]);

  // Restart countdown dengan durasi baru
  const restart = useCallback(
    (newDuration?: number) => {
      const targetDuration = newDuration !== undefined ? newDuration : duration;
      setIsRunning(false);
      setTimeLeft(targetDuration);
      setStartTime(Date.now());
      setPausedTime(null);
      setTotalElapsed(0);
      setIsRunning(true);
    },
    [duration]
  );

  // Tambah waktu ke countdown
  const addTime = useCallback((milliseconds: number) => {
    setTimeLeft((prev) => Math.max(0, prev + milliseconds));
  }, []);

  // Kurangi waktu dari countdown
  const subtractTime = useCallback((milliseconds: number) => {
    setTimeLeft((prev) => Math.max(0, prev - milliseconds));
  }, []);

  // Auto-start jika diatur
  useEffect(() => {
    if (autoStart && duration > 0) {
      setStartTime(Date.now());
      setIsRunning(true);
    }
  }, [autoStart, duration]);

  // Format hasil
  const formattedTime = formatTime(timeLeft);

  return {
    ...formattedTime,
    isRunning,
    start,
    pause,
    resume,
    reset,
    restart,
    addTime,
    subtractTime,
  };
};

/**
 * Hook untuk countdown dengan target date (bukan durasi)
 * @param {Date} targetDate - Tanggal target countdown
 * @param {CountdownOptions} [options] - Opsi untuk countdown
 * @returns {CountdownResult} Objek yang berisi fungsi dan state untuk countdown
 *
 * @example
 * const {
 *   days, hours, minutes, seconds,
 *   isRunning, isCompleted
 * } = useCountdownToDate(new Date("2024-12-31T23:59:59"));
 */
export const useCountdownToDate = (
  targetDate: Date,
  options: CountdownOptions = {}
): CountdownResult => {
  const calculateDuration = useCallback(() => {
    const now = new Date();
    const target = new Date(targetDate);
    return Math.max(0, target.getTime() - now.getTime());
  }, [targetDate]);

  const [duration, setDuration] = useState<number>(calculateDuration());

  // Update duration setiap detik
  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(calculateDuration());
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateDuration]);

  return useCountdown(duration, {
    ...options,
    autoStart: true, // Selalu auto-start untuk countdown to date
  });
};

/**
 * Hook untuk countdown dengan format sederhana hanya detik
 * @param {number} seconds - Jumlah detik
 * @param {CountdownOptions} [options] - Opsi untuk countdown
 * @returns {Object} Objek yang berisi fungsi dan state untuk countdown
 *
 * @example
 * const {
 *   secondsLeft, isRunning, isCompleted,
 *   start, pause, reset
 * } = useSimpleCountdown(60); // 60 detik countdown
 */
export const useSimpleCountdown = (
  seconds: number,
  options: CountdownOptions = {}
) => {
  const countdown = useCountdown(seconds * 1000, options);

  return {
    secondsLeft: countdown.totalSeconds,
    isRunning: countdown.isRunning,
    isCompleted: countdown.isCompleted,
    start: countdown.start,
    pause: countdown.pause,
    resume: countdown.resume,
    reset: countdown.reset,
    restart: (newSeconds?: number) =>
      countdown.restart(
        newSeconds !== undefined ? newSeconds * 1000 : undefined
      ),
    addSeconds: (secondsToAdd: number) =>
      countdown.addTime(secondsToAdd * 1000),
    subtractSeconds: (secondsToSubtract: number) =>
      countdown.subtractTime(secondsToSubtract * 1000),
  };
};
