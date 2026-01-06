"use client";

import { CONFIG } from "@/constants/config";
import { Address } from "viem";
import { useReadContracts } from "wagmi";

export interface StreamDetail {
  balance: bigint;
  ratePerSecond: bigint;
  sender: Address;
  snapshotTime: bigint;
  isStream: boolean;
  isTransferable: boolean;
  isVoided: boolean;
  token: Address;
  tokenDecimals: number;
  snapshotDebtScaled: bigint;
}

interface UseEmployerStreamDetailResult {
  streamDetail: StreamDetail | null;
  withdrawableAmount: bigint | null;
  balance: bigint | null;
  refundableAmount: bigint | null;
  depletionTime: bigint | null;
  status: number | null;
  isPaused: boolean | null;
  isVoided: boolean | null;
  recipient: Address | null;
  ratePerSecond: bigint | null;
  token: Address | null;
  tokenDecimals: number | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useEmployerStreamDetail = (
  streamId: bigint
): UseEmployerStreamDetailResult => {
  const { data, isLoading, error, refetch } = useReadContracts({
    contracts: [
      {
        address: CONFIG.contracts.salary_contract_mancer,
        abi: CONFIG.abi.salary_mancer_abi,
        functionName: "getStream",
        args: [streamId],
      },
      {
        address: CONFIG.contracts.salary_contract_mancer,
        abi: CONFIG.abi.salary_mancer_abi,
        functionName: "withdrawableAmountOf",
        args: [streamId],
      },
      {
        address: CONFIG.contracts.salary_contract_mancer,
        abi: CONFIG.abi.salary_mancer_abi,
        functionName: "getBalance",
        args: [streamId],
      },
      {
        address: CONFIG.contracts.salary_contract_mancer,
        abi: CONFIG.abi.salary_mancer_abi,
        functionName: "refundableAmountOf",
        args: [streamId],
      },
      {
        address: CONFIG.contracts.salary_contract_mancer,
        abi: CONFIG.abi.salary_mancer_abi,
        functionName: "depletionTimeOf",
        args: [streamId],
      },
      {
        address: CONFIG.contracts.salary_contract_mancer,
        abi: CONFIG.abi.salary_mancer_abi,
        functionName: "statusOf",
        args: [streamId],
      },
      {
        address: CONFIG.contracts.salary_contract_mancer,
        abi: CONFIG.abi.salary_mancer_abi,
        functionName: "isPaused",
        args: [streamId],
      },
      {
        address: CONFIG.contracts.salary_contract_mancer,
        abi: CONFIG.abi.salary_mancer_abi,
        functionName: "isVoided",
        args: [streamId],
      },
      {
        address: CONFIG.contracts.salary_contract_mancer,
        abi: CONFIG.abi.salary_mancer_abi,
        functionName: "getRecipient",
        args: [streamId],
      },
      {
        address: CONFIG.contracts.salary_contract_mancer,
        abi: CONFIG.abi.salary_mancer_abi,
        functionName: "getRatePerSecond",
        args: [streamId],
      },
      {
        address: CONFIG.contracts.salary_contract_mancer,
        abi: CONFIG.abi.salary_mancer_abi,
        functionName: "getToken",
        args: [streamId],
      },
      {
        address: CONFIG.contracts.salary_contract_mancer,
        abi: CONFIG.abi.salary_mancer_abi,
        functionName: "getTokenDecimals",
        args: [streamId],
      },
    ],
    query: {
      enabled: !!streamId,
    },
  });

  const processResult = () => {
    if (!data || data.some((result) => result.status === "failure")) {
      return {
        streamDetail: null,
        withdrawableAmount: null,
        balance: null,
        refundableAmount: null,
        depletionTime: null,
        status: null,
        isPaused: null,
        isVoided: null,
        recipient: null,
        ratePerSecond: null,
        token: null,
        tokenDecimals: null,
      };
    }

    const [
      streamData,
      withdrawableAmountData,
      balanceData,
      refundableAmountData,
      depletionTimeData,
      statusData,
      isPausedData,
      isVoidedData,
      recipientData,
      ratePerSecondData,
      tokenData,
      tokenDecimalsData,
    ] = data;

    if (streamData.status === "failure" || !streamData.result) {
      return {
        streamDetail: null,
        withdrawableAmount: null,
        balance: null,
        refundableAmount: null,
        depletionTime: null,
        status: null,
        isPaused: null,
        isVoided: null,
        recipient: null,
        ratePerSecond: null,
        token: null,
        tokenDecimals: null,
      };
    }

    const streamResult = streamData.result;
    const streamDetail: StreamDetail = {
      balance: streamResult.balance,
      ratePerSecond: streamResult.ratePerSecond,
      sender: streamResult.sender,
      snapshotTime: BigInt(streamResult.snapshotTime),
      isStream: streamResult.isStream,
      isTransferable: streamResult.isTransferable,
      isVoided: streamResult.isVoided,
      token: streamResult.token,
      tokenDecimals: streamResult.tokenDecimals,
      snapshotDebtScaled: streamResult.snapshotDebtScaled,
    };

    return {
      streamDetail,
      withdrawableAmount:
        withdrawableAmountData.status === "failure"
          ? null
          : withdrawableAmountData.result,
      balance: balanceData.status === "failure" ? null : balanceData.result,
      refundableAmount:
        refundableAmountData.status === "failure"
          ? null
          : refundableAmountData.result,
      depletionTime:
        depletionTimeData.status === "failure"
          ? null
          : depletionTimeData.result,
      status: statusData.status === "failure" ? null : statusData.result,
      isPaused: isPausedData.status === "failure" ? null : isPausedData.result,
      isVoided: isVoidedData.status === "failure" ? null : isVoidedData.result,
      recipient:
        recipientData.status === "failure" ? null : recipientData.result,
      ratePerSecond:
        ratePerSecondData.status === "failure"
          ? null
          : ratePerSecondData.result,
      token: tokenData.status === "failure" ? null : tokenData.result,
      tokenDecimals:
        tokenDecimalsData.status === "failure"
          ? null
          : tokenDecimalsData.result,
    };
  };

  const processedData = processResult();

  return {
    streamDetail: processedData.streamDetail,
    withdrawableAmount: processedData.withdrawableAmount,
    balance: processedData.balance,
    refundableAmount: processedData.refundableAmount,
    depletionTime: processedData.depletionTime,
    status: processedData.status,
    isPaused: processedData.isPaused,
    isVoided: processedData.isVoided,
    recipient: processedData.recipient,
    ratePerSecond: processedData.ratePerSecond,
    token: processedData.token,
    tokenDecimals: processedData.tokenDecimals,
    loading: isLoading,
    error: error ? "Gagal mengambil detail stream. Silakan coba lagi." : null,
    refetch,
  };
};
