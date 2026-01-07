/**
 * Hook untuk mendapatkan semua stream dimana connected wallet adalah recipient
 *
 * Hook ini digunakan untuk menampilkan daftar stream gaji yang aktif untuk karyawan
 * berdasarkan alamat wallet yang terhubung.
 *
 * Fitur:
 * - Mengambil data stream dari event CreateFlowStream
 * - Filter berdasarkan recipient address
 * - Mengambil token symbol untuk setiap stream
 * - Mengambil status stream (paused, voided, active)
 * - Auto-refresh setiap 30 detik
 * - Loading state dan error handling
 */
"use client";
import { CONFIG } from "@/constants/config";
import { useEffect, useState } from "react";
import { Address, parseAbiItem, formatUnits } from "viem";
import { usePublicClient } from "wagmi";
import { useReadContract } from "wagmi";
import { erc20Abi } from "viem";
import { useGetTokenSymbol } from "./useGetTokenSymbol";
import { useGetTokenDecimals } from "./useGetTokenDecimals";
import { useCalculateMonthlyRate } from "@/libs/hooks";

/**
 * Interface untuk data stream karyawan
 */
export interface EmployeeStream {
  streamId: bigint; // ID unik stream
  sender: Address; // Alamat wallet pengirim gaji (employer)
  recipient: Address; // Alamat wallet penerima gaji (employee/karyawan)
  ratePerSecond: bigint; // Rate aliran gaji per detik
  token: Address; // Alamat kontrak token yang digunakan
  transferable: boolean; // Status apakah stream dapat ditransfer
  tokenSymbol?: string; // Symbol token
  tokenDecimals?: number; // Jumlah desimal token
  isPaused?: boolean; // Status apakah stream di-pause
  isVoided?: boolean; // Status apakah stream sudah di-void
  ratePerMonth?: number; // Rate per bulan (dihitung)
  ratePerMonthFormatted?: string; // Rate per bulan yang diformat
}

/**
 * Hook untuk mendapatkan semua stream dimana connected wallet adalah recipient
 *
 * @param address - Alamat wallet yang akan dicek streamnya
 * @returns Object yang berisi:
 *   - streams: Array data stream karyawan
 *   - loading: Status loading state
 *   - error: Pesan error jika terjadi kesalahan
 *   - refetch: Fungsi untuk memuat ulang data
 */
export const useGetEmployeeStreams = (address: Address, limit: number = 5) => {
  const publicClient = usePublicClient();
  const [streams, setStreams] = useState<EmployeeStream[]>([]);
  const [allStreams, setAllStreams] = useState<EmployeeStream[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { calculateMonthlyRate } = useCalculateMonthlyRate();

  /**
   * Fungsi untuk mengambil data stream dari smart contract
   */
  const fetchStreams = async () => {
    if (!address || !publicClient) return;

    setLoading(true);
    setError(null);

    try {
      const contractAddress = CONFIG.contracts
        .salary_contract_mancer as Address;

      // Parse event CreateFlowStream dari ABI
      const createEvent = parseAbiItem(
        "event CreateFlowStream(uint256 streamId, address indexed sender, address indexed recipient, uint128 ratePerSecond, address indexed token, bool transferable)"
      );

      // Fetch logs dengan filter recipient = connected wallet address
      const logs = await publicClient.getLogs({
        address: contractAddress,
        event: createEvent,
        args: { recipient: address },
        fromBlock: 0n, // Bisa dioptimasi dengan block deployment contract
        toBlock: "latest",
      });

      // Map logs ke format EmployeeStream dasar
      const basicStreams: EmployeeStream[] = logs.map((log) => ({
        streamId: log.args.streamId || 0n,
        sender: log.args.sender || "0x0",
        recipient: log.args.recipient || "0x0",
        ratePerSecond: log.args.ratePerSecond || 0n,
        token: log.args.token || "0x0",
        transferable: log.args.transferable || false,
      }));

      // Enrich streams dengan token info dan status
      const enrichedStreams = await Promise.all(
        basicStreams.map(async (stream) => {
          // Get token symbol
          const tokenSymbolResponse = await publicClient.readContract({
            abi: erc20Abi,
            address: stream.token,
            functionName: "symbol",
          });

          // Get token decimals
          const tokenDecimalsResponse = await publicClient.readContract({
            abi: erc20Abi,
            address: stream.token,
            functionName: "decimals",
          });

          const tokenSymbol = tokenSymbolResponse as string;
          const tokenDecimals = Number(tokenDecimalsResponse) || 18;

          // Calculate monthly rate
          const ratePerMonthInSecond =
            stream.ratePerSecond * 60n * 60n * 24n * 30n;

          const ratePerMonth = Number(
            calculateMonthlyRate(stream.ratePerSecond, tokenDecimals)
          );

          const ratePerMonthFormatted = ratePerMonth.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6,
          });

          // Get stream status
          const isPaused = await publicClient.readContract({
            address: contractAddress,
            abi: CONFIG.abi.salary_mancer_abi,
            functionName: "isPaused",
            args: [stream.streamId],
          });

          const isVoided = await publicClient.readContract({
            address: contractAddress,
            abi: CONFIG.abi.salary_mancer_abi,
            functionName: "isVoided",
            args: [stream.streamId],
          });

          return {
            ...stream,
            tokenSymbol,
            tokenDecimals,
            isPaused: Boolean(isPaused),
            isVoided: Boolean(isVoided),
            ratePerMonth,
            ratePerMonthFormatted,
          };
        })
      );

      setAllStreams(enrichedStreams);
      setStreams(enrichedStreams.slice(0, limit));
    } catch (err) {
      console.error("Error fetching employee streams:", err);
      setError("Gagal mengambil data stream. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh setiap 30 detik untuk update real-time
  useEffect(() => {
    fetchStreams();

    const interval = setInterval(() => {
      fetchStreams();
    }, 1000 * 130); // 130 detik

    return () => clearInterval(interval);
  }, [address, publicClient]);

  // Update streams yang ditampilkan ketika limit berubah
  useEffect(() => {
    if (allStreams.length > 0) {
      setStreams(allStreams.slice(0, limit));
    }
  }, [limit, allStreams]);

  return {
    streams,
    allStreams,
    totalCount: allStreams.length,
    loading,
    error,
    refetch: fetchStreams,
  };
};
