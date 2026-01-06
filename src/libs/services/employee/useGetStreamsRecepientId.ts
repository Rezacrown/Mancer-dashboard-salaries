"use client";
import { CONFIG } from "@/constants/config";
import { useEffect, useState } from "react";
import { Address, parseAbiItem } from "viem";
import { usePublicClient } from "wagmi";

export const useGetStreamsRecepientId = (addr: Address) => {
  const publicClient = usePublicClient();

  const [streamIds, setStreamIds] = useState<bigint[]>([]);

  const fetchLogs = async () => {
    if (!addr || !publicClient) return;

    try {
      // 1. Definisikan Event Signature persis sesuai ABI
      const eventAbi = parseAbiItem(
        "event CreateFlowStream(uint256 streamId, address indexed sender, address indexed recipient, uint128 ratePerSecond, address indexed token, bool transferable)"
      );

      // 2. Fetch Logs
      const logs = await publicClient.getLogs({
        address: CONFIG.contracts.salary_contract_mancer as Address, // Ganti dengan key config contract kamu
        event: eventAbi,
        args: {
          recipient: addr, // Filter: Hanya ambil event dimana recipient == addr user
        },
        fromBlock: 0n, // Optimasi: Ganti dengan block number saat contract dideploy
        toBlock: "latest",
      });

      // 3. Mapping data untuk ambil streamId saja
      const ids = logs.map((log) => log.args.streamId!);

      // Remove duplicate IDs jika perlu (opsional, tergantung logic contract)
      const uniqueIds = Array.from(new Set(ids));

      setStreamIds(uniqueIds);
    } catch (error) {
      console.error("Error fetching stream events:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [addr, publicClient]);

  return streamIds;
};
