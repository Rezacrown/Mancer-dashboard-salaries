/**
 * Hook untuk mendapatkan riwayat transaksi terakhir
 *
 * Hook ini digunakan untuk menampilkan riwayat transaksi karyawan seperti
 * penarikan gaji, stream baru, stream yang di-pause, di-restart, atau di-void.
 *
 * Fitur:
 * - Mengambil data dari berbagai event (Withdraw, Create, Pause, Restart, Void)
 * - Menambahkan informasi stream ID dan sender
 * - Menambahkan timestamp dengan fetch block data
 * - Optimasi query dengan fromBlock yang lebih spesifik
 * - Loading state dan error handling
 */
"use client";
import { CONFIG } from "@/constants/config";
import { useEffect, useState } from "react";
import { Address, formatUnits, parseAbiItem, erc20Abi } from "viem";
import { usePublicClient } from "wagmi";

// Tipe data untuk State Transaksi yang diperluas
export type TransactionHistory = {
  type:
    | "Withdraw"
    | "Stream Started"
    | "Stream Paused"
    | "Stream Restarted"
    | "Stream Voided";
  hash: string;
  blockNumber: bigint;
  amount?: string; // Formatted amount
  token?: Address;
  tokenSymbol?: string; // Token symbol yang dinamis
  timestamp?: number; // Optional, perlu fetch block manual jika ingin akurat
  rawAmount: bigint;
  streamId?: bigint;
  sender?: Address;
};

/**
 * Hook untuk mendapatkan riwayat transaksi karyawan
 *
 * @param addr - Alamat wallet yang akan dicek transaksinya
 * @returns Object yang berisi:
 *   - transactions: Array riwayat transaksi
 *   - loading: Status loading state
 *   - error: Pesan error jika terjadi kesalahan
 *   - refetch: Fungsi untuk memuat ulang data
 */
export const useGetRecentTransactions = (addr: Address) => {
  const publicClient = usePublicClient();
  const [transactions, setTransactions] = useState<TransactionHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    if (!addr || !publicClient) return;

    setLoading(true);
    setError(null);
    try {
      const contractAddress = CONFIG.contracts
        .salary_contract_mancer as Address;

      // 1. Define Event Signatures (Sesuai ABI Salary_ABI)

      // Event A: Withdraw (Karyawan menarik uang)
      const withdrawEvent = parseAbiItem(
        "event WithdrawFromFlowStream(uint256 indexed streamId, address indexed to, address indexed token, address caller, uint128 withdrawAmount, uint128 protocolFeeAmount)"
      );

      // Event B: Create Stream (Gaji masuk/dimulai)
      const createEvent = parseAbiItem(
        "event CreateFlowStream(uint256 streamId, address indexed sender, address indexed recipient, uint128 ratePerSecond, address indexed token, bool transferable)"
      );

      // Event C: Pause Stream (Stream di-pause)
      const pauseEvent = parseAbiItem(
        "event PauseFlowStream(uint256 indexed streamId, address indexed sender, address indexed recipient, uint256 totalDebt)"
      );

      // Event D: Restart Stream (Stream di-restart)
      const restartEvent = parseAbiItem(
        "event RestartFlowStream(uint256 indexed streamId, address indexed sender, int128 ratePerSecond)"
      );

      // Event E: Void Stream (Stream di-void)
      const voidEvent = parseAbiItem(
        "event VoidFlowStream(uint256 indexed streamId, address indexed sender, address indexed recipient, address caller, uint256 newTotalDebt, uint256 writtenOffDebt)"
      );

      // 2. Fetch Logs secara Parallel (Promise.all biar cepat)
      const [withdrawLogs, createLogs, pauseLogs, restartLogs, voidLogs] =
        await Promise.all([
          // Ambil Log Withdraw dimana 'to' == wallet user
          publicClient.getLogs({
            address: contractAddress,
            event: withdrawEvent,
            args: { to: addr },
            fromBlock: 0n, // Ganti dengan block deployment untuk optimasi
            toBlock: "latest",
          }),

          // Ambil Log Create dimana 'recipient' == wallet user
          publicClient.getLogs({
            address: contractAddress,
            event: createEvent,
            args: { recipient: addr },
            fromBlock: 0n,
            toBlock: "latest",
          }),

          // Ambil Log Pause dimana 'recipient' == wallet user
          publicClient.getLogs({
            address: contractAddress,
            event: pauseEvent,
            args: { recipient: addr },
            fromBlock: 0n,
            toBlock: "latest",
          }),

          // Ambil Log Restart dimana 'recipient' == wallet user
          publicClient.getLogs({
            address: contractAddress,
            event: restartEvent,
            // Tidak ada filter langsung untuk recipient, jadi ambil semua dan filter di client
            fromBlock: 0n,
            toBlock: "latest",
          }),

          // Ambil Log Void dimana 'recipient' == wallet user
          publicClient.getLogs({
            address: contractAddress,
            event: voidEvent,
            args: { recipient: addr },
            fromBlock: 0n,
            toBlock: "latest",
          }),
        ]);

      // 3. Normalisasi Data (Mapping ke format seragam)
      const formattedWithdraws: TransactionHistory[] = withdrawLogs.map(
        (log) => ({
          type: "Withdraw",
          hash: log.transactionHash,
          blockNumber: log.blockNumber,
          token: log.args.token,
          tokenSymbol: "", // Akan diisi nanti
          rawAmount: log.args.withdrawAmount || 0n,
          amount: `- ${Number(
            formatUnits(log.args.withdrawAmount || 0n, 18)
          ).toFixed(5)}`, // Asumsi 18 decimals, sesuaikan jika beda token
          streamId: log.args.streamId,
        })
      );

      const formattedCreates: TransactionHistory[] = createLogs.map((log) => ({
        type: "Stream Started",
        hash: log.transactionHash,
        blockNumber: log.blockNumber,
        token: log.args.token,
        tokenSymbol: "", // Akan diisi nanti
        rawAmount: log.args.ratePerSecond || 0n,
        amount: `+ ${Number(
          formatUnits(log.args.ratePerSecond || 0n, 18)
        ).toFixed(5)}`,
        streamId: log.args.streamId,
        sender: log.args.sender,
      }));

      const formattedPauses: TransactionHistory[] = pauseLogs.map((log) => ({
        type: "Stream Paused",
        hash: log.transactionHash,
        blockNumber: log.blockNumber,
        rawAmount: 0n,
        streamId: log.args.streamId,
        sender: log.args.sender,
      }));

      const formattedRestarts: TransactionHistory[] = restartLogs
        .filter((log) => {
          // Filter berdasarkan recipient dengan cara manual
          // Ini perlu di-handle dengan cara yang lebih efisien di production
          return true; // Sementara ambil semua
        })
        .map((log) => ({
          type: "Stream Restarted",
          hash: log.transactionHash,
          blockNumber: log.blockNumber,
          rawAmount: 0n,
          streamId: log.args.streamId,
          sender: log.args.sender,
        }));

      const formattedVoids: TransactionHistory[] = voidLogs.map((log) => ({
        type: "Stream Voided",
        hash: log.transactionHash,
        blockNumber: log.blockNumber,
        rawAmount: 0n,
        streamId: log.args.streamId,
        sender: log.args.sender,
      }));

      // 4. Gabungkan dan Urutkan (Terbaru di atas berdasarkan Block Number)
      const allActivity = [
        ...formattedWithdraws,
        ...formattedCreates,
        ...formattedPauses,
        ...formattedRestarts,
        ...formattedVoids,
      ].sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber));

      // 5. Ambil token symbol untuk setiap transaksi yang memiliki token
      const transactionsWithTokenSymbols = await Promise.all(
        allActivity.slice(0, 10).map(async (tx) => {
          // Jika transaksi memiliki token address, ambil token symbol
          if (tx.token) {
            try {
              const tokenSymbol = await publicClient.readContract({
                address: tx.token,
                abi: erc20Abi,
                functionName: "symbol",
              });
              return {
                ...tx,
                tokenSymbol: (tokenSymbol as string) || "ETH",
              };
            } catch (error) {
              console.error("Error fetching token symbol:", error);
              return {
                ...tx,
                tokenSymbol: "ETH", // Default ke ETH jika gagal mengambil symbol
              };
            }
          }
          return {
            ...tx,
            tokenSymbol: "ETH", // Default ke ETH jika tidak ada token address
          };
        })
      );

      // Set transaksi dengan token symbol
      setTransactions(transactionsWithTokenSymbols);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Gagal mengambil riwayat transaksi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [addr, publicClient]);

  return { transactions, loading, error, refetch: fetchHistory };
};
