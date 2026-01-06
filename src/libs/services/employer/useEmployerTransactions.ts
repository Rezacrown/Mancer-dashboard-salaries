"use client";

import { CONFIG } from "@/constants/config";
import { Address } from "viem";
import { usePublicClient } from "wagmi";
import { useEffect, useState } from "react";

export type EmployerTransaction = {
  type:
    | "Stream Created"
    | "Deposit"
    | "Adjust Rate"
    | "Stream Paused"
    | "Stream Restarted"
    | "Refund"
    | "Stream Voided";
  hash: string;
  blockNumber: bigint;
  amount?: string;
  token?: Address;
  timestamp?: number;
  rawAmount: bigint;
  streamId: bigint;
  recipient?: Address;
  oldRatePerSecond?: bigint;
  newRatePerSecond?: bigint;
};

interface UseEmployerTransactionsResult {
  transactions: EmployerTransaction[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useEmployerTransactions = (
  address: Address
): UseEmployerTransactionsResult => {
  const [transactions, setTransactions] = useState<EmployerTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const publicClient = usePublicClient();

  const fetchTransactions = async () => {
    if (!address || !publicClient) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get all event logs related to the employer address
      const [
        createLogs,
        depositLogs,
        adjustLogs,
        pauseLogs,
        restartLogs,
        refundLogs,
        voidLogs,
      ] = await Promise.all([
        // CreateFlowStream events
        publicClient.getLogs({
          address: CONFIG.contracts.salary_contract_mancer,
          event: {
            type: "event",
            name: "CreateFlowStream",
            inputs: [
              { indexed: false, name: "streamId", type: "uint256" },
              { indexed: true, name: "sender", type: "address" },
              { indexed: true, name: "recipient", type: "address" },
              { indexed: false, name: "ratePerSecond", type: "uint128" },
              { indexed: true, name: "token", type: "address" },
              { indexed: false, name: "transferable", type: "bool" },
            ],
          },
          args: {
            sender: address,
          },
          fromBlock: "earliest",
          toBlock: "latest",
        }),

        // DepositFlowStream events
        publicClient.getLogs({
          address: CONFIG.contracts.salary_contract_mancer,
          event: {
            type: "event",
            name: "DepositFlowStream",
            inputs: [
              { indexed: true, name: "streamId", type: "uint256" },
              { indexed: true, name: "funder", type: "address" },
              { indexed: false, name: "amount", type: "uint128" },
            ],
          },
          args: {
            funder: address,
          },
          fromBlock: "earliest",
          toBlock: "latest",
        }),

        // AdjustFlowStream events
        publicClient.getLogs({
          address: CONFIG.contracts.salary_contract_mancer,
          event: {
            type: "event",
            name: "AdjustFlowStream",
            inputs: [
              { indexed: true, name: "streamId", type: "uint256" },
              { indexed: false, name: "totalDebt", type: "uint256" },
              { indexed: false, name: "oldRatePerSecond", type: "uint128" },
              { indexed: false, name: "newRatePerSecond", type: "uint128" },
            ],
          },
          fromBlock: "earliest",
          toBlock: "latest",
        }),

        // PauseFlowStream events
        publicClient.getLogs({
          address: CONFIG.contracts.salary_contract_mancer,
          event: {
            type: "event",
            name: "PauseFlowStream",
            inputs: [
              { indexed: true, name: "streamId", type: "uint256" },
              { indexed: true, name: "sender", type: "address" },
              { indexed: true, name: "recipient", type: "address" },
              { indexed: false, name: "totalDebt", type: "uint256" },
            ],
          },
          args: {
            sender: address,
          },
          fromBlock: "earliest",
          toBlock: "latest",
        }),

        // RestartFlowStream events
        publicClient.getLogs({
          address: CONFIG.contracts.salary_contract_mancer,
          event: {
            type: "event",
            name: "RestartFlowStream",
            inputs: [
              { indexed: true, name: "streamId", type: "uint256" },
              { indexed: true, name: "sender", type: "address" },
              { indexed: false, name: "ratePerSecond", type: "uint128" },
            ],
          },
          args: {
            sender: address,
          },
          fromBlock: "earliest",
          toBlock: "latest",
        }),

        // RefundFromFlowStream events
        publicClient.getLogs({
          address: CONFIG.contracts.salary_contract_mancer,
          event: {
            type: "event",
            name: "RefundFromFlowStream",
            inputs: [
              { indexed: true, name: "streamId", type: "uint256" },
              { indexed: true, name: "sender", type: "address" },
              { indexed: false, name: "amount", type: "uint128" },
            ],
          },
          args: {
            sender: address,
          },
          fromBlock: "earliest",
          toBlock: "latest",
        }),

        // VoidFlowStream events
        publicClient.getLogs({
          address: CONFIG.contracts.salary_contract_mancer,
          event: {
            type: "event",
            name: "VoidFlowStream",
            inputs: [
              { indexed: true, name: "streamId", type: "uint256" },
              { indexed: true, name: "sender", type: "address" },
              { indexed: true, name: "recipient", type: "address" },
              { indexed: false, name: "caller", type: "address" },
              { indexed: false, name: "newTotalDebt", type: "uint256" },
              { indexed: false, name: "writtenOffDebt", type: "uint256" },
            ],
          },
          args: {
            sender: address,
          },
          fromBlock: "earliest",
          toBlock: "latest",
        }),
      ]);

      // Map all logs to a consistent transaction format
      const allTransactions: EmployerTransaction[] = [];

      // Process CreateFlowStream events
      createLogs.forEach((log) => {
        allTransactions.push({
          type: "Stream Created",
          hash: log.transactionHash,
          blockNumber: log.blockNumber,
          rawAmount: 0n,
          streamId: log.args.streamId as bigint,
          recipient: log.args.recipient as Address,
          token: log.args.token as Address,
        });
      });

      // Process DepositFlowStream events
      depositLogs.forEach((log) => {
        allTransactions.push({
          type: "Deposit",
          hash: log.transactionHash,
          blockNumber: log.blockNumber,
          rawAmount: log.args.amount as bigint,
          streamId: log.args.streamId as bigint,
        });
      });

      // Process AdjustFlowStream events
      adjustLogs.forEach((log) => {
        allTransactions.push({
          type: "Adjust Rate",
          hash: log.transactionHash,
          blockNumber: log.blockNumber,
          rawAmount: 0n,
          streamId: log.args.streamId as bigint,
          oldRatePerSecond: log.args.oldRatePerSecond as bigint,
          newRatePerSecond: log.args.newRatePerSecond as bigint,
        });
      });

      // Process PauseFlowStream events
      pauseLogs.forEach((log) => {
        allTransactions.push({
          type: "Stream Paused",
          hash: log.transactionHash,
          blockNumber: log.blockNumber,
          rawAmount: 0n,
          streamId: log.args.streamId as bigint,
          recipient: log.args.recipient as Address,
        });
      });

      // Process RestartFlowStream events
      restartLogs.forEach((log) => {
        allTransactions.push({
          type: "Stream Restarted",
          hash: log.transactionHash,
          blockNumber: log.blockNumber,
          rawAmount: 0n,
          streamId: log.args.streamId as bigint,
          newRatePerSecond: log.args.ratePerSecond as bigint,
        });
      });

      // Process RefundFromFlowStream events
      refundLogs.forEach((log) => {
        allTransactions.push({
          type: "Refund",
          hash: log.transactionHash,
          blockNumber: log.blockNumber,
          rawAmount: log.args.amount as bigint,
          streamId: log.args.streamId as bigint,
        });
      });

      // Process VoidFlowStream events
      voidLogs.forEach((log) => {
        allTransactions.push({
          type: "Stream Voided",
          hash: log.transactionHash,
          blockNumber: log.blockNumber,
          rawAmount: 0n,
          streamId: log.args.streamId as bigint,
          recipient: log.args.recipient as Address,
        });
      });

      // Sort transactions by block number (newest first)
      const sortedTransactions = allTransactions.sort(
        (a, b) => Number(b.blockNumber) - Number(a.blockNumber)
      );

      setTransactions(sortedTransactions);
    } catch (err) {
      console.error("Error fetching employer transactions:", err);
      setError("Gagal mengambil riwayat transaksi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();

    // Auto-refresh every 30 seconds for real-time updates
    const intervalId = setInterval(fetchTransactions, 30000);

    return () => clearInterval(intervalId);
  }, [address, publicClient]);

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions,
  };
};
