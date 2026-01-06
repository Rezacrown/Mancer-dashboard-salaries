"use client";

import { useState, useEffect } from "react";

/**
 * Interface untuk hasil perhitungan waktu tersisa
 */
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  totalSeconds: number;
  formatted: string;
}

/**
 * Hook untuk menghitung sisa waktu sampai stream habis
 * @param {bigint | number} depletionTimestamp - Timestamp ketika stream akan habis (dalam detik atau milidetik)
 * @param {boolean} [isInMilliseconds=false] - Apakah timestamp dalam milidetik (default: false/detik)
 * @returns {TimeLeft} Objek yang berisi informasi waktu tersisa
 *
 * @example
 * const timeLeft = useCalculateTimeLeft(BigInt(Math.floor(Date.now() / 1000) + 86400)); // 24 jam dari sekarang
 * // timeLeft = { days: 0, hours: 23, minutes: 59, seconds: 45, isExpired: false, totalSeconds: 86385, formatted: "23h 59m 45s" }
 */
export const useCalculateTimeLeft = (
  depletionTimestamp: bigint | number,
  isInMilliseconds: boolean = false
): TimeLeft => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
    totalSeconds: 0,
    formatted: "0s",
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      try {
        // Konversi timestamp ke number jika bigint
        const depletionTime =
          typeof depletionTimestamp === "bigint"
            ? Number(depletionTimestamp)
            : depletionTimestamp;

        // Dapatkan waktu sekarang
        const now = Math.floor(Date.now() / 1000); // dalam detik

        // Konversi depletionTime ke detik jika dalam milidetik
        const depletionTimeInSeconds = isInMilliseconds
          ? Math.floor(depletionTime / 1000)
          : depletionTime;

        // Hitung selisih waktu dalam detik
        const difference = depletionTimeInSeconds - now;

        // Jika waktu sudah habis
        if (difference <= 0) {
          return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isExpired: true,
            totalSeconds: 0,
            formatted: "Expired",
          };
        }

        // Hitung hari, jam, menit, dan detik
        const days = Math.floor(difference / (3600 * 24));
        const hours = Math.floor((difference % (3600 * 24)) / 3600);
        const minutes = Math.floor((difference % 3600) / 60);
        const seconds = difference % 60;

        // Format string yang mudah dibaca
        const formattedParts = [];
        if (days > 0) formattedParts.push(`${days}d`);
        if (hours > 0) formattedParts.push(`${hours}h`);
        if (minutes > 0) formattedParts.push(`${minutes}m`);
        if (seconds > 0 || formattedParts.length === 0)
          formattedParts.push(`${seconds}s`);

        return {
          days,
          hours,
          minutes,
          seconds,
          isExpired: false,
          totalSeconds: difference,
          formatted: formattedParts.join(" "),
        };
      } catch (error) {
        console.error("Error calculating time left:", error);
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: false,
          totalSeconds: 0,
          formatted: "0s",
        };
      }
    };

    // Hitung waktu tersisa
    setTimeLeft(calculateTimeLeft());

    // Setup interval untuk update setiap detik
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Cleanup interval
    return () => clearInterval(timer);
  }, [depletionTimestamp, isInMilliseconds]);

  return timeLeft;
};

/**
 * Hook untuk menghitung persentase waktu yang telah berlalu
 * @param {bigint | number} startTime - Timestamp mulai stream
 * @param {bigint | number} endTime - Timestamp selesai stream
 * @param {boolean} [isInMilliseconds=false] - Apakah timestamp dalam milidetik
 * @returns {number} Persentase waktu yang telah berlalu (0-100)
 *
 * @example
 * const progress = useStreamProgress(startTime, endTime);
 * // progress = 45.5 (45.5% waktu telah berlalu)
 */
export const useStreamProgress = (
  startTime: bigint | number,
  endTime: bigint | number,
  isInMilliseconds: boolean = false
): number => {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const calculateProgress = () => {
      try {
        // Konversi timestamp ke number jika bigint
        const start =
          typeof startTime === "bigint" ? Number(startTime) : startTime;
        const end = typeof endTime === "bigint" ? Number(endTime) : endTime;

        // Dapatkan waktu sekarang
        const now = isInMilliseconds
          ? Date.now()
          : Math.floor(Date.now() / 1000);

        // Konversi timestamp ke detik jika dalam milidetik
        const startInSeconds = isInMilliseconds
          ? Math.floor(start / 1000)
          : start;
        const endInSeconds = isInMilliseconds ? Math.floor(end / 1000) : end;
        const nowInSeconds = isInMilliseconds ? Math.floor(now / 1000) : now;

        // Hitung total durasi dan waktu yang telah berlalu
        const totalDuration = endInSeconds - startInSeconds;
        const elapsed = nowInSeconds - startInSeconds;

        // Hitung persentase
        if (totalDuration <= 0 || elapsed <= 0) return 0;
        if (elapsed >= totalDuration) return 100;

        return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
      } catch (error) {
        console.error("Error calculating stream progress:", error);
        return 0;
      }
    };

    // Hitung progress
    setProgress(calculateProgress());

    // Setup interval untuk update setiap detik
    const timer = setInterval(() => {
      setProgress(calculateProgress());
    }, 1000);

    // Cleanup interval
    return () => clearInterval(timer);
  }, [startTime, endTime, isInMilliseconds]);

  return progress;
};
