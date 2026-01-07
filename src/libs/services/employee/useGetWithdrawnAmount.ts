/**
 * Hook untuk mendapatkan jumlah withdrawn dari stream berdasarkan event WithdrawFromFlowStream
 *
 * Hook ini digunakan untuk mengambil data withdrawn yang sebenarnya dari event `WithdrawFromFlowStream`
 * berdasarkan `streamId`. Data ini memberikan informasi yang lebih akurat tentang jumlah yang telah
 * ditarik dari stream.
 *
 * Fitur:
 * - Mengambil event logs dari smart contract
 * - Filter event WithdrawFromFlowStream berdasarkan streamId
 * - Menghitung total amount yang telah ditarik
 * - Format amount untuk tampilan yang readable
 * - Auto-refresh data setelah transaksi withdraw berhasil
 * - Error handling yang komprehensif
 */
"use client";

import { CONFIG } from "@/constants/config";
import { useState, useEffect } from "react";
import { formatUnits } from "viem";
import { usePublicClient } from "wagmi";
import { useReadContract } from "wagmi";
import { useGetTokenDecimals } from "./useGetTokenDecimals";

/**
 * Hook untuk mendapatkan jumlah withdrawn dari stream berdasarkan event logs
 *
 * @param streamId - ID stream yang akan dicek withdrawn amount-nya
 * @returns Object yang berisi:
 *   - withdrawnAmount: Total jumlah yang telah ditarik dalam satuan terkecil (wei)
 *   - withdrawnAmountFormated: Total jumlah yang telah ditarik dalam format yang readable
 *   - loading: Status loading state
 *   - error: Pesan error jika terjadi kesalahan
 *   - refetch: Fungsi untuk memuat ulang data
 */
export const useGetWithdrawnAmount = (streamId: bigint) => {
  const [withdrawnAmount, setWithdrawnAmount] = useState<bigint>(0n);
  const [withdrawnAmountFormated, setWithdrawnAmountFormated] =
    useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Menggunakan public client untuk mengakses event logs
  const publicClient = usePublicClient();

  // Mengambil data stream untuk mendapatkan token address dan decimals
  const { data: streamData } = useReadContract({
    address: CONFIG.contracts.salary_contract_mancer,
    abi: CONFIG.abi.salary_mancer_abi,
    functionName: "getStream",
    args: [streamId],
    query: {
      enabled: !!streamId && streamId > 0n,
    },
  });

  // Mendapatkan token address dari stream data
  const tokenAddress = streamData?.token as `0x${string}`;

  // Mendapatkan token decimals untuk formatting
  const { decimals } = useGetTokenDecimals(tokenAddress);

  // Fungsi untuk mengambil event logs dan menghitung total withdrawn amount
  const fetchWithdrawnAmount = async () => {
    if (!streamId || streamId === 0n) {
      setWithdrawnAmount(0n);
      setWithdrawnAmountFormated("0");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Mengambil event logs WithdrawFromFlowStream berdasarkan streamId
      const logs = await publicClient?.getLogs({
        address: CONFIG.contracts.salary_contract_mancer,
        event: {
          name: "WithdrawFromFlowStream",
          inputs: [
            {
              indexed: true,
              name: "streamId",
              type: "uint256",
            },
            {
              indexed: true,
              name: "to",
              type: "address",
            },
            {
              indexed: true,
              name: "token",
              type: "address",
            },
            {
              indexed: false,
              name: "caller",
              type: "address",
            },
            {
              indexed: false,
              name: "withdrawAmount",
              type: "uint128",
            },
            {
              indexed: false,
              name: "protocolFeeAmount",
              type: "uint128",
            },
          ],
          type: "event",
        },
        args: {
          streamId: streamId,
        } as any,
        fromBlock: "earliest",
        toBlock: "latest",
      });

      // Menghitung total withdrawn amount dari semua event yang ditemukan
      let totalWithdrawn = 0n;
      if (logs && logs.length > 0) {
        for (const log of logs) {
          // @ts-ignore - TypeScript tidak bisa mendeteksi type dari event args dengan baik
          const withdrawAmount = log.args.withdrawAmount as bigint;
          totalWithdrawn += withdrawAmount;
        }
      }

      setWithdrawnAmount(totalWithdrawn);

      // Format amount untuk tampilan yang readable
      const tokenDecimals = decimals || streamData?.tokenDecimals || 18;
      const formattedAmount = formatUnits(totalWithdrawn, tokenDecimals);
      setWithdrawnAmountFormated(formattedAmount);
    } catch (err) {
      console.error("Error fetching withdrawn amount:", err);

      // Handle error message yang user-friendly
      if (err instanceof Error) {
        setError(`Gagal mengambil data withdrawn: ${err.message}`);
      } else {
        setError("Gagal mengambil data withdrawn. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk refresh data
  const refetch = () => {
    fetchWithdrawnAmount();
  };

  // Mengambil data saat component mount atau streamId berubah
  useEffect(() => {
    if (streamData) {
      fetchWithdrawnAmount();
    }
  }, [streamId, decimals, streamData]);

  // Auto-refresh data setelah transaksi withdraw berhasil
  useEffect(() => {
    // Listener untuk menangkap event WithdrawFromFlowStream
    const handleWithdrawEvent = (event: Event) => {
      if (event instanceof CustomEvent) {
        const { streamId: eventStreamId } = event.detail;
        if (eventStreamId === streamId) {
          fetchWithdrawnAmount();
        }
      }
    };

    // Menambahkan event listener
    window.addEventListener("withdrawSuccess", handleWithdrawEvent);

    // Membersihkan event listener saat component unmount
    return () => {
      window.removeEventListener("withdrawSuccess", handleWithdrawEvent);
    };
  }, [streamId]);

  return {
    withdrawnAmount,
    withdrawnAmountFormated,
    loading,
    error,
    refetch,
  };
};
