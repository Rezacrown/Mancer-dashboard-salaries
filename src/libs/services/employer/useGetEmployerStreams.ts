"use client";

import { CONFIG } from "@/constants/config";
import { Address } from "viem";
import { usePublicClient } from "wagmi";
import { useEffect, useState } from "react";

export interface EmployerStream {
  streamId: bigint;
  sender: Address;
  recipient: Address;
  ratePerSecond: bigint;
  token: Address;
  transferable: boolean;
}

interface UseGetEmployerStreamsResult {
  streams: EmployerStream[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useGetEmployerStreams = (
  address: Address
): UseGetEmployerStreamsResult => {
  const [streams, setStreams] = useState<EmployerStream[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const publicClient = usePublicClient();

  const fetchStreams = async () => {
    if (!address || !publicClient) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get CreateFlowStream events where the sender is the connected address
      const logs = await publicClient!.getLogs({
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
      });

      const employerStreams: EmployerStream[] = logs.map((log) => ({
        streamId: log.args.streamId as bigint,
        sender: log.args.sender as Address,
        recipient: log.args.recipient as Address,
        ratePerSecond: log.args.ratePerSecond as bigint,
        token: log.args.token as Address,
        transferable: log.args.transferable as boolean,
      }));

      setStreams(employerStreams);
    } catch (err) {
      console.error("Error fetching employer streams:", err);
      setError("Gagal mengambil data stream. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStreams();

    // Auto-refresh every 30 seconds for real-time updates
    const intervalId = setInterval(fetchStreams, 30000);

    return () => clearInterval(intervalId);
  }, [address, publicClient]);

  return {
    streams,
    loading,
    error,
    refetch: fetchStreams,
  };
};
