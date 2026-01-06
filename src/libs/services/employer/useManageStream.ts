"use client";

import { CONFIG } from "@/constants/config";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useState } from "react";

interface UseManageStreamResult {
  pauseStream: (streamId: bigint) => Promise<void>;
  restartStream: (streamId: bigint, newRatePerSecond?: bigint) => Promise<void>;
  adjustRate: (streamId: bigint, newRatePerSecond: bigint) => Promise<void>;
  voidStream: (streamId: bigint) => Promise<void>;
  refund: (streamId: bigint, amount?: bigint) => Promise<void>;
  refundMax: (streamId: bigint) => Promise<void>;
  refundAndPause: (streamId: bigint, amount?: bigint) => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
  error: Error | null;
  reset: () => void;
}

export const useManageStream = (): UseManageStreamResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    console.error("Error managing stream:", err);

    // Handle specific error messages
    if (err.message?.includes("MancerFlow_StreamPaused")) {
      setError(new Error("Stream sudah di-pause"));
    } else if (err.message?.includes("MancerFlow_StreamNotPaused")) {
      setError(new Error("Stream tidak di-pause"));
    } else if (err.message?.includes("MancerFlow_StreamVoided")) {
      setError(new Error("Stream sudah di-void"));
    } else if (err.message?.includes("MancerFlow_RatePerSecondNotDifferent")) {
      setError(new Error("Rate per second tidak berbeda"));
    } else if (err.message?.includes("MancerFlow_RefundAmountZero")) {
      setError(new Error("Jumlah refund tidak valid"));
    } else {
      setError(new Error("Gagal mengelola stream. Silakan coba lagi."));
    }

    setIsLoading(false);
  };

  const pauseStream = async (streamId: bigint) => {
    try {
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);

      await writeContract({
        address: CONFIG.contracts.salary_contract_mancer,
        abi: CONFIG.abi.salary_mancer_abi,
        functionName: "pause",
        args: [streamId],
      });

      if (hash) {
        setTxnHash(hash);
      }
    } catch (err: any) {
      handleError(err);
    }
  };

  const restartStream = async (streamId: bigint, newRatePerSecond?: bigint) => {
    try {
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);

      await writeContract({
        address: CONFIG.contracts.salary_contract_mancer,
        abi: CONFIG.abi.salary_mancer_abi,
        functionName: "restart",
        args: [streamId, newRatePerSecond || 0n],
      });

      if (hash) {
        setTxnHash(hash);
      }
    } catch (err: any) {
      handleError(err);
    }
  };

  const adjustRate = async (streamId: bigint, newRatePerSecond: bigint) => {
    try {
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);

      await writeContract({
        address: CONFIG.contracts.salary_contract_mancer,
        abi: CONFIG.abi.salary_mancer_abi,
        functionName: "adjustRatePerSecond",
        args: [streamId, newRatePerSecond],
      });

      if (hash) {
        setTxnHash(hash);
      }
    } catch (err: any) {
      handleError(err);
    }
  };

  const voidStream = async (streamId: bigint) => {
    try {
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);

      await writeContract({
        address: CONFIG.contracts.salary_contract_mancer,
        abi: CONFIG.abi.salary_mancer_abi,
        functionName: "void",
        args: [streamId],
      });

      if (hash) {
        setTxnHash(hash);
      }
    } catch (err: any) {
      handleError(err);
    }
  };

  const refund = async (streamId: bigint, amount?: bigint) => {
    try {
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);

      await writeContract({
        address: CONFIG.contracts.salary_contract_mancer,
        abi: CONFIG.abi.salary_mancer_abi,
        functionName: "refund",
        args: [streamId, amount || 0n],
      });

      if (hash) {
        setTxnHash(hash);
      }
    } catch (err: any) {
      handleError(err);
    }
  };

  const refundMax = async (streamId: bigint) => {
    try {
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);

      await writeContract({
        address: CONFIG.contracts.salary_contract_mancer,
        abi: CONFIG.abi.salary_mancer_abi,
        functionName: "refundMax",
        args: [streamId],
      });

      if (hash) {
        setTxnHash(hash);
      }
    } catch (err: any) {
      handleError(err);
    }
  };

  const refundAndPause = async (streamId: bigint, amount?: bigint) => {
    try {
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);

      await writeContract({
        address: CONFIG.contracts.salary_contract_mancer,
        abi: CONFIG.abi.salary_mancer_abi,
        functionName: "refundAndPause",
        args: [streamId, amount || 0n],
      });

      if (hash) {
        setTxnHash(hash);
      }
    } catch (err: any) {
      handleError(err);
    }
  };

  const reset = () => {
    setIsLoading(false);
    setIsSuccess(false);
    setError(null);
    setTxnHash(null);
  };

  // Update states based on transaction status
  if (isConfirmed && !isSuccess) {
    setIsSuccess(true);
    setIsLoading(false);
  }

  if (writeError && !error) {
    handleError(writeError);
  }

  return {
    pauseStream,
    restartStream,
    adjustRate,
    voidStream,
    refund,
    refundMax,
    refundAndPause,
    isLoading: isLoading || isWritePending || isConfirming,
    isSuccess,
    error,
    reset,
  };
};
