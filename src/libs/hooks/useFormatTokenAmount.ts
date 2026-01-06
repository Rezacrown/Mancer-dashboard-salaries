"use client";

import { formatUnits } from "viem";

/**
 * Hook untuk memformat jumlah token dengan desimal yang benar
 * @returns {Function} Fungsi untuk memformat jumlah token
 *
 * @example
 * const { formatTokenAmount } = useFormatTokenAmount();
 * const formattedAmount = formatTokenAmount(BigInt(1000000000000000000), 18); // "1.0"
 */
export const useFormatTokenAmount = () => {
  /**
   * Memformat jumlah token dengan desimal yang benar
   * @param {bigint} amount - Jumlah token dalam satuan terkecil (wei)
   * @param {number} decimals - Jumlah desimal token (default: 18)
   * @param {number} [maxPrecision] - Maksimal presisi desimal yang ditampilkan (default: 6)
   * @returns {string} Jumlah token yang sudah diformat
   */
  const formatTokenAmount = (
    amount: bigint,
    decimals: number = 18,
    maxPrecision: number = 6
  ): string => {
    try {
      // Format menggunakan viem's formatUnits
      const formatted = formatUnits(amount, decimals);

      // Konversi ke number untuk pembulatan
      const numValue = parseFloat(formatted);

      // Jika nilai sangat kecil, tampilkan dalam notasi ilmiah atau 0
      if (numValue < 1e-10 && numValue > 0) {
        return "<0.000001";
      }

      // Pembulatan dengan presisi maksimal
      const rounded = numValue.toFixed(maxPrecision);

      // Hapus trailing zeros
      const trimmed = rounded.replace(/\.?0+$/, "");

      return trimmed;
    } catch (error) {
      console.error("Error formatting token amount:", error);
      return "0";
    }
  };

  return { formatTokenAmount };
};
