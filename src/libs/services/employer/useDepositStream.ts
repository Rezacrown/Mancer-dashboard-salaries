"use client";

import { CONFIG } from "@/constants/config";
import { Address } from "viem";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { useState } from "react";

export interface Broker {
  account: Address;
  fee: bigint;
}

interface UseDepositStreamResult {
  deposit: (
    streamId: bigint,
    amount: bigint,
    sender: Address,
    recipient: Address
  ) => Promise<void>;
  depositViaBroker: (
    streamId: bigint,
    amount: bigint,
    sender: Address,
    recipient: Address,
    broker: Broker
  ) => Promise<void>;
  isDepositing: boolean;
  isSuccess: boolean;
  error: Error | null;
  reset: () => void;
}

export const useDepositStream = (): UseDepositStreamResult => {
  const [isDepositing, setIsDepositing] = useState<boolean>(false);
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
    console.error("Error depositing to stream:", err);

    // Handle specific error messages
    if (err.message?.includes("MancerFlow_DepositAmountZero")) {
      setError(new Error("Jumlah deposit tidak valid"));
    } else if (err.message?.includes("MancerFlow_StreamVoided")) {
      setError(new Error("Stream sudah di-void"));
    } else {
      setError(
        new Error("Gagal menambahkan dana ke stream. Silakan coba lagi.")
      );
    }

    setIsDepositing(false);
  };

  const deposit = async (
    streamId: bigint,
    amount: bigint,
    sender: Address,
    recipient: Address
  ) => {
    try {
      setIsDepositing(true);
      setError(null);
      setIsSuccess(false);

      await writeContract({
        address: CONFIG.contracts.salary_contract_mancer,
        abi: CONFIG.abi.salary_mancer_abi,
        functionName: "deposit",
        args: [streamId, amount, sender, recipient],
      });

      if (hash) {
        setTxnHash(hash);
      }
    } catch (err: any) {
      handleError(err);
    }
  };

  const depositViaBroker = async (
    streamId: bigint,
    amount: bigint,
    sender: Address,
    recipient: Address,
    broker: Broker
  ) => {
    try {
      setIsDepositing(true);
      setError(null);
      setIsSuccess(false);

      await writeContract({
        address: CONFIG.contracts.salary_contract_mancer,
        abi: CONFIG.abi.salary_mancer_abi,
        functionName: "depositViaBroker",
        args: [streamId, amount, sender, recipient, broker],
      });

      if (hash) {
        setTxnHash(hash);
      }
    } catch (err: any) {
      handleError(err);
    }
  };

  const reset = () => {
    setIsDepositing(false);
    setIsSuccess(false);
    setError(null);
    setTxnHash(null);
  };

  // Update states based on transaction status
  if (isConfirmed && !isSuccess) {
    setIsSuccess(true);
    setIsDepositing(false);
  }

  if (writeError && !error) {
    handleError(writeError);
  }

  return {
    deposit,
    depositViaBroker,
    isDepositing: isDepositing || isWritePending || isConfirming,
    isSuccess,
    error,
    reset,
  };
};
