"use client";

import { formatUnits } from "viem";

/**
 * Interface untuk hasil perhitungan protocol fee
 */
interface ProtocolFeeResult {
  feeAmount: bigint;
  feeAmountFormatted: string;
  netAmount: bigint;
  netAmountFormatted: string;
  protocolFeePercentage: number;
}

/**
 * Hook untuk menghitung protocol fee untuk withdrawal
 * @returns {Object} Objek yang berisi fungsi untuk menghitung protocol fee
 *
 * @example
 * const { calculateProtocolFee, getProtocolFeePercentage } = useProtocolFeeCalculation();
 * const feeResult = calculateProtocolFee(BigInt(1000000000000000000), 18, BigInt(100)); // 1% fee
 * // feeResult = { feeAmount: 10000000000000000, feeAmountFormatted: "0.01", netAmount: 990000000000000000, netAmountFormatted: "0.99", protocolFeePercentage: 1 }
 */
export const useProtocolFeeCalculation = () => {
  /**
   * Menghitung protocol fee untuk withdrawal
   * @param {bigint} amount - Jumlah token yang akan diwithdraw
   * @param {number} decimals - Jumlah desimal token (default: 18)
   * @param {bigint} protocolFee - Protocol fee dalam basis point (1 basis point = 0.01%)
   * @returns {ProtocolFeeResult} Hasil perhitungan protocol fee
   */
  const calculateProtocolFee = (
    amount: bigint,
    decimals: number = 18,
    protocolFee: bigint = 100n // Default 1% (100 basis points)
  ): ProtocolFeeResult => {
    try {
      // Konversi basis points ke persentase (100 basis points = 1%)
      const protocolFeePercentage = Number(protocolFee) / 100;

      // Hitung fee amount: (amount * protocolFee) / 10000
      const feeAmount = (amount * protocolFee) / 10000n;

      // Hitung net amount: amount - feeAmount
      const netAmount = amount - feeAmount;

      // Format hasilnya
      const feeAmountFormatted = formatUnits(feeAmount, decimals);
      const netAmountFormatted = formatUnits(netAmount, decimals);

      return {
        feeAmount,
        feeAmountFormatted,
        netAmount,
        netAmountFormatted,
        protocolFeePercentage,
      };
    } catch (error) {
      console.error("Error calculating protocol fee:", error);
      return {
        feeAmount: 0n,
        feeAmountFormatted: "0",
        netAmount: amount,
        netAmountFormatted: formatUnits(amount, decimals),
        protocolFeePercentage: 0,
      };
    }
  };

  /**
   * Menghitung protocol fee dengan persentase langsung (bukan basis points)
   * @param {bigint} amount - Jumlah token yang akan diwithdraw
   * @param {number} decimals - Jumlah desimal token (default: 18)
   * @param {number} feePercentage - Persentase fee (contoh: 1 untuk 1%)
   * @returns {ProtocolFeeResult} Hasil perhitungan protocol fee
   */
  const calculateProtocolFeeFromPercentage = (
    amount: bigint,
    decimals: number = 18,
    feePercentage: number = 1
  ): ProtocolFeeResult => {
    try {
      // Konversi persentase ke basis points
      const protocolFee = BigInt(Math.floor(feePercentage * 100));

      return calculateProtocolFee(amount, decimals, protocolFee);
    } catch (error) {
      console.error("Error calculating protocol fee from percentage:", error);
      return {
        feeAmount: 0n,
        feeAmountFormatted: "0",
        netAmount: amount,
        netAmountFormatted: formatUnits(amount, decimals),
        protocolFeePercentage: 0,
      };
    }
  };

  /**
   * Menghitung protocol fee untuk multiple token dengan fee berbeda
   * @param {Array<{amount: bigint, decimals: number, protocolFee: bigint}>} tokenList - Daftar token dengan amount dan fee masing-masing
   * @returns {Array<ProtocolFeeResult>} Hasil perhitungan protocol fee untuk setiap token
   */
  const calculateMultipleProtocolFees = (
    tokenList: Array<{
      amount: bigint;
      decimals: number;
      protocolFee: bigint;
    }>
  ): Array<ProtocolFeeResult> => {
    try {
      return tokenList.map((token) =>
        calculateProtocolFee(token.amount, token.decimals, token.protocolFee)
      );
    } catch (error) {
      console.error("Error calculating multiple protocol fees:", error);
      return tokenList.map((token) => ({
        feeAmount: 0n,
        feeAmountFormatted: "0",
        netAmount: token.amount,
        netAmountFormatted: formatUnits(token.amount, token.decimals),
        protocolFeePercentage: 0,
      }));
    }
  };

  /**
   * Menghitung total protocol fee dari multiple token
   * @param {Array<{amount: bigint, decimals: number, protocolFee: bigint}>} tokenList - Daftar token dengan amount dan fee masing-masing
   * @returns {ProtocolFeeResult} Hasil perhitungan total protocol fee
   */
  const calculateTotalProtocolFee = (
    tokenList: Array<{
      amount: bigint;
      decimals: number;
      protocolFee: bigint;
    }>
  ): ProtocolFeeResult => {
    try {
      const results = calculateMultipleProtocolFees(tokenList);

      // Hitung total fee amount dan net amount
      const totalFeeAmount = results.reduce(
        (sum, result) => sum + result.feeAmount,
        0n
      );
      const totalNetAmount = results.reduce(
        (sum, result) => sum + result.netAmount,
        0n
      );
      const totalAmount = results.reduce(
        (sum, result) => sum + result.feeAmount + result.netAmount,
        0n
      );

      // Rata-rata persentase fee
      const avgFeePercentage =
        results.reduce((sum, result) => sum + result.protocolFeePercentage, 0) /
        results.length;

      // Gunakan decimals dari token pertama untuk format (atau 18 sebagai default)
      const decimals = tokenList[0]?.decimals || 18;

      return {
        feeAmount: totalFeeAmount,
        feeAmountFormatted: formatUnits(totalFeeAmount, decimals),
        netAmount: totalNetAmount,
        netAmountFormatted: formatUnits(totalNetAmount, decimals),
        protocolFeePercentage: avgFeePercentage,
      };
    } catch (error) {
      console.error("Error calculating total protocol fee:", error);
      // Gunakan decimals dari token pertama untuk format (atau 18 sebagai default)
      const decimals = tokenList[0]?.decimals || 18;
      const totalAmount = tokenList.reduce(
        (sum, token) => sum + token.amount,
        0n
      );

      return {
        feeAmount: 0n,
        feeAmountFormatted: "0",
        netAmount: totalAmount,
        netAmountFormatted: formatUnits(totalAmount, decimals),
        protocolFeePercentage: 0,
      };
    }
  };

  /**
   * Mengkonversi basis points ke persentase
   * @param {bigint} basisPoints - Nilai dalam basis points
   * @returns {number} Nilai dalam persentase
   */
  const basisPointsToPercentage = (basisPoints: bigint): number => {
    return Number(basisPoints) / 100;
  };

  /**
   * Mengkonversi persentase ke basis points
   * @param {number} percentage - Nilai dalam persentase
   * @returns {bigint} Nilai dalam basis points
   */
  const percentageToBasisPoints = (percentage: number): bigint => {
    return BigInt(Math.floor(percentage * 100));
  };

  return {
    calculateProtocolFee,
    calculateProtocolFeeFromPercentage,
    calculateMultipleProtocolFees,
    calculateTotalProtocolFee,
    basisPointsToPercentage,
    percentageToBasisPoints,
  };
};
