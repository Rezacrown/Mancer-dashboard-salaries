"use client";
import { useReadContract } from "wagmi";
import { erc20Abi, Address } from "viem";

/**
 * Hook untuk mendapatkan symbol token dari kontrak ERC20
 *
 * @param tokenAddress - Alamat kontrak token
 * @returns Symbol token
 */
export const useGetTokenSymbol = (tokenAddress: Address) => {
  const { data, isLoading } = useReadContract({
    abi: erc20Abi,
    address: tokenAddress,
    functionName: "symbol",
    query: {
      staleTime: 60 * 60 * 1000, // 1 hour
    },
  });

  return { symbol: data as string, isLoading };
};
