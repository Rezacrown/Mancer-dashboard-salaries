"use client";

import { formatUnits } from "viem";

/**
 * Hook untuk konversi rate per detik ke rate per bulan
 * @returns {Object} Objek yang berisi fungsi untuk menghitung rate bulanan
 *
 * @example
 * const { calculateMonthlyRate, calculateMonthlyRateFromBigInt } = useCalculateMonthlyRate();
 * const monthlyRate = calculateMonthlyRate(BigInt(38580246913580), 18); // 100000
 */
export const useCalculateMonthlyRate = () => {
  // Konstanta waktu dalam detik
  const SECONDS_PER_MINUTE = 60n;
  const MINUTES_PER_HOUR = 60n;
  const HOURS_PER_DAY = 24n;
  const DAYS_PER_MONTH = 30n; // Menggunakan 30 hari standar untuk perhitungan

  // Total detik dalam sebulan
  const SECONDS_PER_MONTH =
    SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY * DAYS_PER_MONTH;

  /**
   * Menghitung rate per bulan dari rate per detik
   * @param {bigint} ratePerSecond - Rate per detik dalam bentuk bigint
   * @param {number} decimals - Jumlah desimal token (default: 18)
   * @returns {string} Rate per bulan yang sudah diformat
   */
  const calculateMonthlyRate = (
    ratePerSecond: bigint,
    decimals: number = 18
  ): string => {
    try {
      // Hitung rate per bulan: ratePerSecond * detik dalam sebulan
      const monthlyRate = ratePerSecond * SECONDS_PER_MONTH;

      // Format hasilnya dengan jumlah desimal yang tepat
      return formatUnits(monthlyRate, decimals);
    } catch (error) {
      console.error("Error calculating monthly rate:", error);
      return "0";
    }
  };

  /**
   * Menghitung rate per bulan dari rate per detik dan mengembalikan dalam bentuk bigint
   * @param {bigint} ratePerSecond - Rate per detik dalam bentuk bigint
   * @returns {bigint} Rate per bulan dalam bentuk bigint
   */
  const calculateMonthlyRateFromBigInt = (ratePerSecond: bigint): bigint => {
    try {
      // Hitung rate per bulan: ratePerSecond * detik dalam sebulan
      return ratePerSecond * SECONDS_PER_MONTH;
    } catch (error) {
      console.error("Error calculating monthly rate as bigint:", error);
      return 0n;
    }
  };

  /**
   * Menghitung rate per detik dari rate per bulan
   * @param {bigint} monthlyRate - Rate per bulan dalam bentuk bigint
   * @returns {bigint} Rate per detik dalam bentuk bigint
   */
  const calculateRatePerSecondFromMonthly = (monthlyRate: bigint): bigint => {
    try {
      // Hitung rate per detik: monthlyRate / detik dalam sebulan
      return monthlyRate / SECONDS_PER_MONTH;
    } catch (error) {
      console.error("Error calculating rate per second from monthly:", error);
      return 0n;
    }
  };

  return {
    calculateMonthlyRate,
    calculateMonthlyRateFromBigInt,
    calculateRatePerSecondFromMonthly,
  };
};
