"use client";

import { CONFIG } from "@/constants/config";
import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";

interface Stream {
  id: number;
  sender: string;
  recipient: string;
  ratePerMonth: number;
  token: string;
  totalStreamed: number;
  withdrawn: number;
  balance: number;
  startDate: string;
  endDate: string;
  status: string;
}

export const useActiveStream = (streamId: bigint = 1n) => {
  const [activeStream, setActiveStream] = useState<Stream>({
    id: 1,
    sender: "0x1234...5678",
    recipient: "0x8765...4321",
    ratePerMonth: 20000,
    token: "USDT",
    totalStreamed: 11377.93,
    withdrawn: 7256.0,
    balance: 4120.92,
    startDate: "01 Jan 2024",
    endDate: "01 Jan 2025",
    status: "Streaming",
  });

  const {
    data: stream,
    isFetched,
    isFetching,
  } = useReadContract({
    abi: CONFIG.abi.salary_mancer_abi,
    address: CONFIG.contracts.salary_contract_mancer,
    functionName: "getStream",
    args: [streamId],
  });

  return {
    stream,
  };
};
