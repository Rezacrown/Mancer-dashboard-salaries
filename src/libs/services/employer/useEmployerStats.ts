"use client";

import { CONFIG } from "@/constants/config";
import { Address } from "viem";
import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { useGetTokenSymbol } from "../employee";

export interface EmployerStats {
  totalStreams: number;
  activeStreams: number;
  pausedStreams: number;
  voidedStreams: number;
  totalValueLocked: string;
  totalDeposited: string;
  totalWithdrawn: string;
  totalRefunded: string;
  monthlyPayout: string;
}

interface UseEmployerStatsResult {
  stats: EmployerStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useEmployerStats = (address: Address): UseEmployerStatsResult => {
  // Get employer streams to calculate stats
  const {
    data: streamsData,
    isLoading: streamsLoading,
    error: streamsError,
    refetch: streamsRefetch,
  } = useReadContract({
    address: CONFIG.contracts.salary_contract_mancer,
    abi: CONFIG.abi.salary_mancer_abi,
    functionName: "balanceOf",
    args: [address],
  });

  // Get aggregate balance for PHII token
  const { data: aggregateBalanceData, isLoading: balanceLoading } =
    useReadContract({
      address: CONFIG.contracts.salary_contract_mancer,
      abi: CONFIG.abi.salary_mancer_abi,
      functionName: "aggregateBalance",
      args: [CONFIG.contracts.phii_coin_address],
    });

  // Get total streams count (simulated)
  const { data: nextStreamIdData } = useReadContract({
    address: CONFIG.contracts.salary_contract_mancer,
    abi: CONFIG.abi.salary_mancer_abi,
    functionName: "nextStreamId",
  });

  // Note: In a real implementation, we would need to get all streams for the employer
  // to calculate accurate statistics. For now, we'll simulate with placeholder data.

  const calculateStats = (): EmployerStats | null => {
    if (streamsLoading || balanceLoading) {
      return null;
    }

    try {
      // Placeholder values for demonstration
      // In a real app, these would be calculated from actual stream data
      const totalStreams = nextStreamIdData ? Number(nextStreamIdData) : 0;
      const activeStreams = Math.floor(totalStreams * 0.7); // 70% of total streams are active
      const pausedStreams = Math.floor(totalStreams * 0.2); // 20% are paused
      const voidedStreams = totalStreams - activeStreams - pausedStreams; // Rest are voided

      const balance = aggregateBalanceData ? aggregateBalanceData : 0n;
      const totalValueLocked = formatUnits(balance, 18); // Assuming 18 decimals

      // Placeholder calculations for demonstration
      const totalDeposited = formatUnits(BigInt(Number(balance) * 1.5), 18);
      const totalWithdrawn = formatUnits(BigInt(Number(balance) * 0.3), 18);
      const totalRefunded = formatUnits(BigInt(Number(balance) * 0.2), 18);

      // Calculate monthly payout (30 days * 24 hours * 60 minutes * 60 seconds)
      const avgRatePerSecond = balance / BigInt(totalStreams || 1);
      const monthlyPayout = formatUnits(
        avgRatePerSecond * BigInt(30 * 24 * 60 * 60),
        18
      );

      return {
        totalStreams,
        activeStreams,
        pausedStreams,
        voidedStreams,
        totalValueLocked,
        totalDeposited,
        totalWithdrawn,
        totalRefunded,
        monthlyPayout,
      };
    } catch (err) {
      console.error("Error calculating stats:", err);
      return null;
    }
  };

  const stats = calculateStats();

  return {
    stats,
    loading: streamsLoading || balanceLoading,
    error: streamsError
      ? "Gagal mengambil statistik employer. Silakan coba lagi."
      : null,
    refetch: streamsRefetch,
  };
};
