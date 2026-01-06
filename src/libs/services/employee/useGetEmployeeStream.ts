"use client";
import { CONFIG } from "@/constants/config";
import { useReadContract } from "wagmi";

export const useGetEmployeeStream = () => {
  const streamIDMock = BigInt(1);
  const mockAddress = "0x8Df44cbEae7E9227DE84947d9C350b18A1b5a04b";

  const { data: streamStatus } = useReadContract({
    address: CONFIG.contracts.salary_contract_mancer,
    abi: CONFIG.abi.salary_mancer_abi,
    functionName: "statusOf",
    args: [streamIDMock],
  });

  const { data: streamData } = useReadContract({
    address: CONFIG.contracts.salary_contract_mancer,
    abi: CONFIG.abi.salary_mancer_abi,
    functionName: "getStream",
    args: [streamIDMock],
  });

  console.log(streamStatus, streamData);

  return { streamStatus: Boolean(streamStatus), streamData };
};
