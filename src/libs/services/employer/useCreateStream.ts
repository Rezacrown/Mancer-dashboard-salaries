"use client";

import { CONFIG } from "@/constants/config";
import { Address } from "viem";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useState } from "react";

export interface CreateStreamParams {
  recipient: Address;
  ratePerSecond: bigint;
  token: Address;
  transferable: boolean;
}

export interface CreateAndDepositStreamParams extends CreateStreamParams {
  amount: bigint;
}

interface UseCreateStreamResult {
  createStream: (params: CreateStreamParams) => Promise<void>;
  createAndDepositStream: (
    params: CreateAndDepositStreamParams
  ) => Promise<void>;
  isCreating: boolean;
  isSuccess: boolean;
  error: Error | null;
  reset: () => void;
}

export const useCreateStream = (sender: Address): UseCreateStreamResult => {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [txnHash, setTxnHash] = useState<`0x${string}` | null>(null);

  const {
    writeContract,
    data: hash,
    isPending: isWritePending,
    error: writeError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txnHash || hash,
    });

  const handleError = (err: any) => {
    console.error("Error creating stream:", err);

    // Handle specific error messages
    if (err.message?.includes("MancerFlow_SenderZeroAddress")) {
      setError(new Error("Alamat sender tidak valid"));
    } else if (err.message?.includes("MancerFlow_InvalidTokenDecimals")) {
      setError(new Error("Token decimals tidak valid"));
    } else {
      setError(new Error("Gagal membuat stream. Silakan coba lagi."));
    }

    setIsCreating(false);
  };

  const createStream = async (params: CreateStreamParams) => {
    try {
      setIsCreating(true);
      setError(null);
      setIsSuccess(false);

      await writeContract({
        address: CONFIG.contracts.salary_contract_mancer,
        abi: CONFIG.abi.salary_mancer_abi,
        functionName: "create",
        args: [
          sender,
          params.recipient,
          params.ratePerSecond,
          params.token,
          params.transferable,
        ],
      });

      if (hash) {
        setTxnHash(hash);
      }
    } catch (err: any) {
      handleError(err);
    }
  };

  const createAndDepositStream = async (
    params: CreateAndDepositStreamParams
  ) => {
    try {
      setIsCreating(true);
      setError(null);
      setIsSuccess(false);

      await writeContract({
        address: CONFIG.contracts.salary_contract_mancer,
        abi: CONFIG.abi.salary_mancer_abi,
        functionName: "createAndDeposit",
        args: [
          sender,
          params.recipient,
          params.ratePerSecond,
          params.token,
          params.transferable,
          params.amount,
        ],
      });

      if (hash) {
        setTxnHash(hash);
      }
    } catch (err: any) {
      handleError(err);
    }
  };

  const reset = () => {
    setIsCreating(false);
    setIsSuccess(false);
    setError(null);
    setTxnHash(null);
  };

  // Update states based on transaction status
  if (isConfirmed && !isSuccess) {
    setIsSuccess(true);
    setIsCreating(false);
  }

  if (writeError && !error) {
    handleError(writeError);
  }

  return {
    createStream,
    createAndDepositStream,
    isCreating: isCreating || isWritePending || isConfirming,
    isSuccess,
    error,
    reset,
  };
};
