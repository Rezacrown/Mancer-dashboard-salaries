"use client";
import { useReadContract } from "wagmi";
import { erc20Abi, Address } from "viem";

/**
 * Hook untuk mendapatkan decimals token dari kontrak ERC20
 *
 * @param tokenAddress - Alamat kontrak token
 * @returns Decimals token
 */
export const useGetTokenDecimals = (tokenAddress: Address) => {
  const { data, isLoading } = useReadContract({
    abi: erc20Abi,
    address: tokenAddress,
    functionName: "decimals",
    query: {
      staleTime: 60 * 60 * 1000, // 1 hour
    },
  });

  return { decimals: Number(data) || 18, isLoading };
};
