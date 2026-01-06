/**
 * Hook untuk mendapatkan detail stream untuk employee
 *
 * Hook ini digunakan untuk menampilkan informasi lengkap tentang stream gaji
 * termasuk balance, withdrawable amount, status, dan informasi penting lainnya.
 *
 * Fitur:
 * - Mengambil data stream lengkap melalui getStream()
 * - Menghitung jumlah yang dapat ditarik melalui withdrawableAmountOf()
 * - Mengecek status stream (paused, voided, active)
 * - Loading state untuk setiap query
 * - Error handling yang komprehensif
 */
"use client";
import { CONFIG } from "@/constants/config";
import { useState } from "react";
import { Address, formatUnits } from "viem";
import { useReadContract } from "wagmi";

/**
 * Interface untuk detail stream yang lengkap
 */
export interface StreamDetail {
  balance: bigint; // Sisa balance dalam stream
  ratePerSecond: bigint; // Rate aliran gaji per detik
  sender: Address; // Alamat wallet pengirim (employer)
  snapshotTime: bigint; // Waktu snapshot terakhir
  isStream: boolean; // Status apakah masih aktif sebagai stream
  isTransferable: boolean; // Status apakah stream dapat ditransfer
  isVoided: boolean; // Status apakah stream sudah di-void
  token: Address; // Alamat kontrak token yang digunakan
  tokenDecimals: number; // Jumlah desimal token
  snapshotDebtScaled: bigint; // Debt snapshot yang diskalakan
}

/**
 * Hook untuk mendapatkan detail stream dan informasi terkait
 *
 * @param streamId - ID stream yang akan dicek detailnya
 * @returns Object yang berisi:
 *   - streamDetail: Data detail stream lengkap
 *   - withdrawableAmount: Jumlah yang dapat ditarik
 *   - balance: Sisa balance stream
 *   - status: Status stream (numerik)
 *   - isPaused: Status apakah stream di-pause
 *   - isVoided: Status apakah stream sudah di-void
 *   - loading: Status loading state
 *   - error: Pesan error jika terjadi kesalahan
 *   - refetch: Fungsi untuk memuat ulang data
 */
export const useEmployeeStreamDetail = (streamId: bigint) => {
  // Query untuk mendapatkan data stream lengkap
  const {
    data: streamData,
    isLoading: isStreamLoading,
    error: streamError,
    refetch: refetchStream,
  } = useReadContract({
    address: CONFIG.contracts.salary_contract_mancer,
    abi: CONFIG.abi.salary_mancer_abi,
    functionName: "getStream",
    args: [streamId],
    query: {
      enabled: !!streamId && streamId > 0n,
    },
  });

  // Query untuk mendapatkan jumlah yang dapat ditarik
  const {
    data: withdrawableAmount,
    isLoading: isWithdrawableLoading,
    error: withdrawableError,
    refetch: refetchWithdrawable,
  } = useReadContract({
    address: CONFIG.contracts.salary_contract_mancer,
    abi: CONFIG.abi.salary_mancer_abi,
    functionName: "withdrawableAmountOf",
    args: [streamId],
    query: {
      enabled: !!streamId && streamId > 0n,
    },
  });

  // Query untuk mendapatkan balance stream
  const {
    data: balance,
    isLoading: isBalanceLoading,
    error: balanceError,
    refetch: refetchBalance,
  } = useReadContract({
    address: CONFIG.contracts.salary_contract_mancer,
    abi: CONFIG.abi.salary_mancer_abi,
    functionName: "getBalance",
    args: [streamId],
    query: {
      enabled: !!streamId && streamId > 0n,
    },
  });

  // Query untuk mendapatkan status stream
  const {
    data: status,
    isLoading: isStatusLoading,
    error: statusError,
    refetch: refetchStatus,
  } = useReadContract({
    address: CONFIG.contracts.salary_contract_mancer,
    abi: CONFIG.abi.salary_mancer_abi,
    functionName: "statusOf",
    args: [streamId],
    query: {
      enabled: !!streamId && streamId > 0n,
    },
  });

  // Query untuk mengecek apakah stream di-pause
  const {
    data: isPaused,
    isLoading: isPausedLoading,
    error: pausedError,
    refetch: refetchPaused,
  } = useReadContract({
    address: CONFIG.contracts.salary_contract_mancer,
    abi: CONFIG.abi.salary_mancer_abi,
    functionName: "isPaused",
    args: [streamId],
    query: {
      enabled: !!streamId && streamId > 0n,
    },
  });

  // Query untuk mengecek apakah stream sudah di-void
  const {
    data: isVoided,
    isLoading: isVoidedLoading,
    error: voidedError,
    refetch: refetchVoided,
  } = useReadContract({
    address: CONFIG.contracts.salary_contract_mancer,
    abi: CONFIG.abi.salary_mancer_abi,
    functionName: "isVoided",
    args: [streamId],
    query: {
      enabled: !!streamId && streamId > 0n,
    },
  });

  // Format data stream jika tersedia
  const streamDetail: StreamDetail | null = streamData
    ? {
        balance:
          BigInt(formatUnits(streamData.balance, streamData.tokenDecimals)) ||
          0n,
        ratePerSecond: streamData.ratePerSecond || 0n,
        sender: streamData.sender || "0x0",
        snapshotTime: BigInt(streamData.snapshotTime || 0),
        isStream: streamData.isStream || false,
        isTransferable: streamData.isTransferable || false,
        isVoided: streamData.isVoided || false,
        token: streamData.token || "0x0",
        tokenDecimals: Number(streamData.tokenDecimals) || 18,
        snapshotDebtScaled: streamData.snapshotDebtScaled || 0n,
      }
    : null;

  // Menggabungkan semua loading status
  const loading =
    isStreamLoading ||
    isWithdrawableLoading ||
    isBalanceLoading ||
    isStatusLoading ||
    isPausedLoading ||
    isVoidedLoading;

  // Menggabungkan semua error message
  const error =
    streamError ||
    withdrawableError ||
    balanceError ||
    statusError ||
    pausedError ||
    voidedError;

  // Fungsi untuk memuat ulang semua data
  const refetch = () => {
    refetchStream();
    refetchWithdrawable();
    refetchBalance();
    refetchStatus();
    refetchPaused();
    refetchVoided();
  };

  return {
    streamDetail,
    withdrawableAmount: withdrawableAmount || null,
    balance: balance || null,
    status: status !== undefined ? Number(status) : null,
    isPaused: isPaused || null,
    isVoided: isVoided || null,
    loading,
    error,
    refetch,
  };
};
