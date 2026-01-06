"use client";

import { useState } from "react";
import {
  useReadContract,
  useWriteContract,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { parseUnits, formatUnits, Address, Hash, erc20Abi } from "viem";

/**
 * Interface untuk token approval options
 */
interface TokenApprovalOptions {
  tokenAddress: Address;
  spenderAddress: Address;
  amount: bigint;
  decimals?: number;
  symbol?: string;
}

/**
 * Interface untuk token approval state
 */
interface TokenApprovalState {
  isApproving: boolean;
  isApproved: boolean;
  isChecking: boolean;
  error: string | null;
  txHash: Hash | null | undefined;
  currentAllowance: bigint;
  isAllowanceSufficient: boolean;
}

/**
 * Hook untuk cek dan approve token
 * @param {TokenApprovalOptions} options - Opsi untuk token approval
 * @returns {Object} Objek yang berisi fungsi dan state untuk token approval
 *
 * @example
 * const {
 *   checkApproval,
 *   approveToken,
 *   isApproved,
 *   isApproving,
 *   currentAllowance
 * } = useTokenApproval({
 *   tokenAddress: "0x123...abc",
 *   spenderAddress: "0x456...def",
 *   amount: parseUnits("100", 18),
 *   decimals: 18,
 *   symbol: "USDT"
 * });
 *
 * // Cek approval
 * await checkApproval();
 *
 * // Approve token jika belum di-approve
 * if (!isApproved) {
 *   await approveToken();
 * }
 */
export const useTokenApproval = (options: TokenApprovalOptions) => {
  const {
    tokenAddress,
    spenderAddress,
    amount,
    decimals = 18,
    symbol = "TOKEN",
  } = options;

  const [state, setState] = useState<TokenApprovalState>({
    isApproving: false,
    isApproved: false,
    isChecking: true,
    error: null,
    txHash: null,
    currentAllowance: 0n,
    isAllowanceSufficient: false,
  });

  // Get connected account
  const { address: ownerAddress } = useAccount();

  // Read current allowance
  const {
    data: allowanceData,
    refetch: refetchAllowance,
    isFetching: isAllowanceFetching,
  } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "allowance",
    args: [
      ownerAddress || "0x0000000000000000000000000000000000000000",
      spenderAddress,
    ],
    query: {
      enabled: !!ownerAddress,
    },
  });

  // Simulate approve contract
  const { data: simulateData } = useSimulateContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "approve",
    args: [spenderAddress, amount],
  });

  // Write contract for approve
  const {
    writeContract,
    isPending: isWritePending,
    data: writeData,
  } = useWriteContract();

  // Wait for transaction receipt
  const {
    data: receipt,
    isPending: isReceiptPending,
    isSuccess: isTxSuccess,
    isError: isTxError,
  } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  // Update state when allowance data changes
  const updateAllowanceState = (allowance: bigint | undefined) => {
    const currentAllowance = allowance || 0n;
    const isAllowanceSufficient = currentAllowance >= amount;

    setState((prev) => ({
      ...prev,
      currentAllowance,
      isAllowanceSufficient,
      isApproved: isAllowanceSufficient,
      isChecking: false,
    }));
  };

  // Check approval status
  const checkApproval = async (): Promise<boolean> => {
    try {
      setState((prev) => ({ ...prev, isChecking: true, error: null }));

      await refetchAllowance();
      updateAllowanceState(allowanceData);

      return state.isApproved;
    } catch (error) {
      console.error("Error checking token approval:", error);
      setState((prev) => ({
        ...prev,
        isChecking: false,
        error: "Gagal mengecek approval token",
      }));
      return false;
    }
  };

  // Approve token
  const approveToken = async (): Promise<Hash | null> => {
    try {
      if (!simulateData) {
        setState((prev) => ({
          ...prev,
          error: "Simulasi transaksi gagal",
        }));
        return null;
      }

      setState((prev) => ({
        ...prev,
        isApproving: true,
        error: null,
      }));

      writeContract(simulateData.request);

      return writeData || null;
    } catch (error) {
      console.error("Error approving token:", error);
      setState((prev) => ({
        ...prev,
        isApproving: false,
        error: "Gagal melakukan approve token",
      }));
      return null;
    }
  };

  // Handle transaction state changes
  const handleTransactionComplete = async () => {
    if (isTxSuccess) {
      setState((prev) => ({
        ...prev,
        isApproving: false,
        isApproved: true,
        isAllowanceSufficient: true,
        txHash: writeData || null,
      }));

      // Re-fetch allowance after successful transaction
      await refetchAllowance();
      updateAllowanceState(allowanceData);
    } else if (isTxError) {
      setState((prev) => ({
        ...prev,
        isApproving: false,
        error: "Transaksi approval gagal",
      }));
    }
  };

  // Reset state
  const resetState = (): void => {
    setState({
      isApproving: false,
      isApproved: false,
      isChecking: true,
      error: null,
      txHash: null,
      currentAllowance: 0n,
      isAllowanceSufficient: false,
    });
  };

  // Format allowance for display
  const formattedAllowance = formatUnits(state.currentAllowance, decimals);
  const formattedAmount = formatUnits(amount, decimals);
  const allowancePercentage =
    state.currentAllowance > 0n
      ? Number((state.currentAllowance * 100n) / amount)
      : 0;

  // React to changes in allowance data
  if (allowanceData !== undefined && !isAllowanceFetching) {
    updateAllowanceState(allowanceData);
  }

  // React to transaction completion
  if (isTxSuccess || isTxError) {
    handleTransactionComplete();
  }

  return {
    // State
    isApproving: isWritePending || isReceiptPending || state.isApproving,
    isApproved: state.isApproved,
    isChecking: state.isChecking || isAllowanceFetching,
    error: state.error,
    txHash: state.txHash || writeData || null,
    currentAllowance: state.currentAllowance,
    isAllowanceSufficient: state.isAllowanceSufficient,

    // Formatted values
    formattedAllowance,
    formattedAmount,
    allowancePercentage,

    // Actions
    checkApproval,
    approveToken,
    resetState,

    // Transaction status
    isTxSuccess,
    isTxError,
    isWritePending,
    isReceiptPending,
  };
};

/**
 * Hook untuk multiple token approvals
 * @param {Array<TokenApprovalOptions>} tokenOptions - Array opsi token approval
 * @returns {Object} Objek yang berisi fungsi dan state untuk multiple token approvals
 *
 * @example
 * const tokenApprovals = useMultipleTokenApprovals([
 *   { tokenAddress: "0x123...abc", spenderAddress: "0x456...def", amount: parseUnits("100", 18) },
 *   { tokenAddress: "0x789...xyz", spenderAddress: "0x456...def", amount: parseUnits("50", 6) }
 * ]);
 *
 * // Check all approvals
 * await tokenApprovals.checkAllApprovals();
 *
 * // Approve all tokens that need approval
 * await tokenApprovals.approveAllTokens();
 */
export const useMultipleTokenApprovals = (
  tokenOptions: Array<TokenApprovalOptions>
) => {
  const [isApprovingAll, setIsApprovingAll] = useState(false);
  const [errors, setErrors] = useState<Array<{ index: number; error: string }>>(
    []
  );

  // Create individual approval hooks for each token
  const tokenApprovals = tokenOptions.map((options, index) => ({
    ...useTokenApproval(options),
    index,
  }));

  /**
   * Check all token approvals
   */
  const checkAllApprovals = async (): Promise<boolean> => {
    try {
      setErrors([]);
      const results = await Promise.all(
        tokenApprovals.map((approval) => approval.checkApproval())
      );
      return results.every((result) => result);
    } catch (error) {
      console.error("Error checking all token approvals:", error);
      return false;
    }
  };

  /**
   * Approve all tokens that need approval
   */
  const approveAllTokens = async (): Promise<
    Array<{ index: number; success: boolean; txHash?: Hash }>
  > => {
    try {
      setIsApprovingAll(true);
      setErrors([]);

      const results = await Promise.allSettled(
        tokenApprovals
          .filter((approval) => !approval.isApproved)
          .map((approval) => approval.approveToken())
      );

      const approvalResults = results.map((result, index) => {
        const tokenIndex = tokenApprovals.findIndex(
          (approval) => !approval.isApproved
        );
        return {
          index: tokenIndex,
          success: result.status === "fulfilled",
          txHash:
            result.status === "fulfilled"
              ? (result.value as Hash | undefined)
              : undefined,
        };
      });

      // Collect errors
      const newErrors = results
        .map((result, index) => {
          const tokenIndex = tokenApprovals.findIndex(
            (approval) => !approval.isApproved
          );
          return result.status === "rejected"
            ? { index: tokenIndex, error: result.reason as string }
            : null;
        })
        .filter(Boolean) as Array<{ index: number; error: string }>;

      setErrors(newErrors);

      return approvalResults;
    } catch (error) {
      console.error("Error approving all tokens:", error);
      return [];
    } finally {
      setIsApprovingAll(false);
    }
  };

  /**
   * Get all tokens that need approval
   */
  const getTokensNeedingApproval = () => {
    return tokenApprovals.filter((approval) => !approval.isApproved);
  };

  /**
   * Check if all tokens are approved
   */
  const areAllTokensApproved = () => {
    return tokenApprovals.every((approval) => approval.isApproved);
  };

  return {
    // Individual token approvals
    tokenApprovals,

    // Batch operations
    checkAllApprovals,
    approveAllTokens,
    getTokensNeedingApproval,
    areAllTokensApproved,

    // State
    isApprovingAll,
    errors,

    // Reset
    resetAll: () => tokenApprovals.forEach((approval) => approval.resetState()),
  };
};
