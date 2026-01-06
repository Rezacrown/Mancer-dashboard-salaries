/**
 * Hook untuk mendapatkan saldo wallet untuk berbagai token
 *
 * Hook ini digunakan untuk menampilkan saldo wallet karyawan untuk berbagai token
 * seperti ETH, PHII, dan USDT.
 *
 * Fitur:
 * - Mengambil saldo untuk ETH, PHII, dan USDT
 * - Menambahkan informasi token address dan decimals
 * - Loading state untuk setiap token
 * - Error handling yang lebih baik
 * - Refetch functionality
 */
"use client";
import { CONFIG } from "@/constants/config";
import { useState } from "react";
import { Address, erc20Abi, formatUnits } from "viem";
import { useReadContract } from "wagmi";

/**
 * Interface untuk aset wallet yang diperluas
 */
export interface WalletAsset {
  symbol: string;
  balance: string;
  address: Address;
  decimals: number;
  isLoading?: boolean;
  error?: string | null;
}

/**
 * Hook untuk mendapatkan saldo wallet karyawan
 *
 * @param addr - Alamat wallet yang akan dicek saldonya
 * @returns Array yang berisi data aset wallet (ETH, PHII, USDT)
 */
export const useGetEmployeeWalletBalance = (addr: Address) => {
  const {
    data: ethBalance,
    isLoading: isEthLoading,
    error: ethError,
    refetch: refetchEth,
  } = useReadContract({
    abi: erc20Abi,
    address: CONFIG.contracts.eth_edu_testnet,
    functionName: "balanceOf",
    args: [addr],
    query: {
      enabled: !!addr,
    },
  });

  // PHII Balance
  const {
    data: phiiBalance,
    isLoading: isPhiiLoading,
    error: phiiError,
    refetch: refetchPhii,
  } = useReadContract({
    abi: erc20Abi,
    address: CONFIG.contracts.phii_coin_address,
    functionName: "balanceOf",
    args: [addr],
    query: {
      enabled: !!addr,
    },
  });

  // USDT Balance
  const {
    data: usdtBalance,
    isLoading: isUsdtLoading,
    error: usdtError,
    refetch: refetchUsdt,
  } = useReadContract({
    abi: erc20Abi,
    address: CONFIG.contracts.usdt_edu_testnet,
    functionName: "balanceOf",
    args: [addr],
    query: {
      enabled: !!addr,
    },
  });

  // PHII Decimals
  const { data: phiiDecimal, isLoading: isPhiiDecimalLoading } =
    useReadContract({
      abi: erc20Abi,
      address: CONFIG.contracts.phii_coin_address,
      functionName: "decimals",
      query: {
        enabled: !!addr,
      },
    });

  // Format data ETH
  const ethAsset: WalletAsset = {
    symbol: "ETH",
    balance: ethBalance ? formatUnits(ethBalance, 18).toString() : "0",
    address: CONFIG.contracts.eth_edu_testnet,
    decimals: 18,
    isLoading: isEthLoading,
    error: ethError?.message,
  };

  // Format data PHII
  const phiiAsset: WalletAsset = {
    symbol: "PHII",
    balance: phiiBalance
      ? formatUnits(phiiBalance, phiiDecimal || 18).toString()
      : "0",
    address: CONFIG.contracts.phii_coin_address,
    decimals: phiiDecimal ? Number(phiiDecimal) : 18,
    isLoading: isPhiiLoading || isPhiiDecimalLoading,
    error: phiiError?.message,
  };

  // Format data USDT
  const usdtAsset: WalletAsset = {
    symbol: "USDT",
    balance: usdtBalance ? formatUnits(usdtBalance, 8).toString() : "0",
    address: CONFIG.contracts.usdt_edu_testnet,
    decimals: 8,
    isLoading: isUsdtLoading,
    error: usdtError?.message,
  };

  // Fungsi untuk refetch semua data
  const refetch = () => {
    refetchEth();
    refetchPhii();
    refetchUsdt();
  };

  return {
    assets: [ethAsset, phiiAsset, usdtAsset],
    loading:
      isEthLoading || isPhiiLoading || isPhiiDecimalLoading || isUsdtLoading,
    error: ethError || phiiError || usdtError,
    refetch,
  };
};
