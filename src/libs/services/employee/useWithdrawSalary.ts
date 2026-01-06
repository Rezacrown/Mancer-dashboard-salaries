/**
 * Hook untuk menarik salary dari stream
 *
 * Hook ini digunakan untuk mengeksekusi penarikan gaji dari stream yang aktif.
 * Mendukung penarikan jumlah tertentu atau penarikan maksimum.
 *
 * Fitur:
 * - withdraw(): Menarik jumlah tertentu dari stream
 * - withdrawMax(): Menarik semua jumlah yang tersedia
 * - Error handling untuk berbagai kasus error
 * - Loading states untuk UX yang baik
 * - Reset state setelah transaksi selesai
 */
"use client";
import { CONFIG } from "@/constants/config";
import { useState } from "react";
import { Address } from "viem";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";

/**
 * Hook untuk menarik salary dari stream
 *
 * @param streamId - ID stream yang akan ditarik
 * @param to - Alamat tujuan penarikan (optional, default ke connected wallet)
 * @returns Object yang berisi:
 *   - withdraw: Fungsi untuk menarik jumlah tertentu
 *   - withdrawMax: Fungsi untuk menarik semua jumlah yang tersedia
 *   - isWithdrawing: Status loading saat penarikan
 *   - isSuccess: Status apakah transaksi berhasil
 *   - error: Error object jika terjadi kesalahan
 *   - reset: Fungsi untuk mereset state
 */
export const useWithdrawSalary = (streamId: bigint, to?: Address) => {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Hook untuk menulis ke contract
  const {
    data: hash,
    writeContract,
    isPending: isWritePending,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  // Hook untuk menunggu transaksi selesai
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Fungsi untuk menarik jumlah tertentu
  const withdraw = async (amount?: bigint) => {
    if (!streamId || streamId === 0n) {
      throw new Error("Stream ID tidak valid");
    }

    setIsWithdrawing(true);
    setIsSuccess(false);

    try {
      const recipientAddress = to || undefined; // Jika 'to' tidak disediakan, gunakan default dari wallet

      if (amount && amount > 0n) {
        // withdraw(streamId, to, amount)
        writeContract({
          address: CONFIG.contracts.salary_contract_mancer,
          abi: CONFIG.abi.salary_mancer_abi,
          functionName: "withdraw",
          args: [streamId, recipientAddress || "0x0", amount],
        });
      } else {
        // Jika amount tidak disediakan, gunakan withdrawMax
        writeContract({
          address: CONFIG.contracts.salary_contract_mancer,
          abi: CONFIG.abi.salary_mancer_abi,
          functionName: "withdrawMax",
          args: [streamId, recipientAddress || "0x0"],
        });
      }
    } catch (err) {
      console.error("Error initiating withdraw:", err);
      setIsWithdrawing(false);
      throw err;
    }
  };

  // Fungsi untuk menarik semua jumlah yang tersedia
  const withdrawMax = async () => {
    if (!streamId || streamId === 0n) {
      throw new Error("Stream ID tidak valid");
    }

    setIsWithdrawing(true);
    setIsSuccess(false);

    try {
      const recipientAddress = to || undefined; // Jika 'to' tidak disediakan, gunakan default dari wallet

      writeContract({
        address: CONFIG.contracts.salary_contract_mancer,
        abi: CONFIG.abi.salary_mancer_abi,
        functionName: "withdrawMax",
        args: [streamId, recipientAddress || "0x0"],
      });
    } catch (err) {
      console.error("Error initiating withdrawMax:", err);
      setIsWithdrawing(false);
      throw err;
    }
  };

  // Handle error message yang user-friendly
  const getUserFriendlyErrorMessage = (error: any) => {
    if (!error) return null;

    const errorMessage = error.message || error.toString();

    // Mapping error contract ke pesan yang user-friendly
    if (errorMessage.includes("MancerFlow_Overdraw")) {
      return "Anda mencoba menarik lebih dari yang tersedia";
    }

    if (errorMessage.includes("MancerFlow_StreamPaused")) {
      return "Stream ini sedang di-pause";
    }

    if (errorMessage.includes("MancerFlow_StreamVoided")) {
      return "Stream sudah berakhir";
    }

    if (errorMessage.includes("MancerFlow_WithdrawAmountZero")) {
      return "Jumlah penarikan tidak boleh nol";
    }

    if (errorMessage.includes("MancerFlow_WithdrawToZeroAddress")) {
      return "Alamat tujuan tidak valid";
    }

    if (errorMessage.includes("MancerFlow_WithdrawalAddressNotRecipient")) {
      return "Anda tidak berhak menarik dari stream ini";
    }

    if (errorMessage.includes("MancerFlow_Unauthorized")) {
      return "Anda tidak memiliki izin untuk melakukan penarikan";
    }

    return "Terjadi kesalahan saat melakukan penarikan. Silakan coba lagi.";
  };

  // Update state ketika transaksi selesai
  const combinedError = writeError || confirmError;
  const userFriendlyError = getUserFriendlyErrorMessage(combinedError);

  // Reset state ketika transaksi berhasil
  if (isConfirmed && !isSuccess) {
    setIsSuccess(true);
    setIsWithdrawing(false);
  }

  // Reset state ketika terjadi error
  if (combinedError && isWithdrawing) {
    setIsWithdrawing(false);
  }

  // Fungsi untuk mereset semua state
  const reset = () => {
    setIsWithdrawing(false);
    setIsSuccess(false);
    resetWrite();
  };

  return {
    withdraw,
    withdrawMax,
    isWithdrawing: isWithdrawing || isWritePending || isConfirming,
    isSuccess,
    error: userFriendlyError,
    reset,
  };
};
