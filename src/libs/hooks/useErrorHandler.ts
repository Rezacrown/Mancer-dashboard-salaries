"use client";

import { useState } from "react";
import { ContractFunctionRevertedError, BaseError } from "viem";

/**
 * Interface untuk error handling options
 */
interface ErrorHandlerOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  customMessages?: Record<string, string>;
  fallbackMessage?: string;
}

/**
 * Interface untuk hasil error handling
 */
interface ErrorHandlerResult {
  errorMessage: string;
  errorType: string;
  errorCode?: string;
  hasError: boolean;
  error: unknown;
  reset: () => void;
}

/**
 * Interface untuk parsed contract error
 */
interface ParsedContractError {
  name: string;
  message: string;
  code?: string;
  isUserRejection: boolean;
  isContractRevert: boolean;
  details?: string;
}

/**
 * Hook untuk handle error dari smart contract calls
 * @param {ErrorHandlerOptions} [options] - Opsi untuk error handling
 * @returns {ErrorHandlerResult} Objek yang berisi fungsi dan state untuk error handling
 *
 * @example
 * const { handleError, error, errorMessage, reset } = useErrorHandler({
 *   showToast: true,
 *   customMessages: {
 *     "MancerFlow_Overdraw": "Jumlah penarikan melebihi batas yang tersedia",
 *     "MancerFlow_Unauthorized": "Anda tidak memiliki izin untuk melakukan tindakan ini"
 *   }
 * });
 *
 * try {
 *   // Lakukan transaksi
 * } catch (err) {
 *   handleError(err);
 * }
 */
export const useErrorHandler = (options: ErrorHandlerOptions = {}) => {
  const {
    showToast = true,
    logToConsole = true,
    customMessages = {},
    fallbackMessage = "Terjadi kesalahan, silakan coba lagi",
  } = options;

  const [error, setError] = useState<unknown>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errorType, setErrorType] = useState<string>("");
  const [errorCode, setErrorCode] = useState<string | undefined>(undefined);

  /**
   * Parse error dari smart contract call
   * @param {unknown} err - Error yang akan diparse
   * @returns {ParsedContractError} Hasil parsing error
   */
  const parseContractError = (err: unknown): ParsedContractError => {
    // Default values
    const result: ParsedContractError = {
      name: "UnknownError",
      message: fallbackMessage,
      isUserRejection: false,
      isContractRevert: false,
    };

    try {
      // Check if it's a Viem BaseError
      if (err instanceof BaseError) {
        result.name = err.name;
        result.message = err.shortMessage || err.message;

        // Check for user rejection
        if (err.name === "UserRejectedRequestError") {
          result.isUserRejection = true;
          result.message = "Transaksi dibatalkan oleh pengguna";
          return result;
        }

        // Check for contract revert
        if (err instanceof ContractFunctionRevertedError) {
          result.isContractRevert = true;
          result.name = err.data?.errorName || "ContractReverted";

          // Try to get the error details
          if (err.data?.args) {
            const args = err.data.args as any[];
            if (args.length > 0 && typeof args[0] === "string") {
              result.details = args[0];
            }
          }

          // Use custom message if available
          if (customMessages[result.name]) {
            result.message = customMessages[result.name];
          } else if (result.details) {
            result.message = result.details;
          }

          return result;
        }

        // Check for other specific Viem errors
        if (err.details) {
          result.details = err.details;
        }

        // Try to get error code if it exists
        const errWithCode = err as any;
        if (errWithCode.code) {
          result.code = errWithCode.code.toString();
        }

        return result;
      }

      // Check if it's a regular Error
      if (err instanceof Error) {
        result.name = err.name;
        result.message = err.message;

        // Check for user rejection in regular errors
        if (
          err.message.includes("user rejected") ||
          err.message.includes("User denied")
        ) {
          result.isUserRejection = true;
          result.message = "Transaksi dibatalkan oleh pengguna";
        }

        return result;
      }

      // Handle string errors
      if (typeof err === "string") {
        result.message = err;

        // Check for user rejection in string errors
        if (err.includes("user rejected") || err.includes("User denied")) {
          result.isUserRejection = true;
          result.message = "Transaksi dibatalkan oleh pengguna";
        }

        return result;
      }

      // Handle object errors
      if (typeof err === "object" && err !== null) {
        const objErr = err as any;
        result.name = objErr.name || "ObjectError";
        result.message = objErr.message || objErr.reason || fallbackMessage;

        if (objErr.code) {
          result.code = objErr.code.toString();
        }

        if (objErr.data?.errorName) {
          result.name = objErr.data.errorName;
          result.isContractRevert = true;

          // Use custom message if available
          if (customMessages[result.name]) {
            result.message = customMessages[result.name];
          }
        }

        return result;
      }

      return result;
    } catch (parseError) {
      console.error("Error parsing contract error:", parseError);
      return {
        name: "ParseError",
        message: fallbackMessage,
        isUserRejection: false,
        isContractRevert: false,
      };
    }
  };

  /**
   * Handle error dari smart contract call
   * @param {unknown} err - Error yang akan dihandle
   */
  const handleError = (err: unknown): void => {
    try {
      // Parse the error
      const parsedError = parseContractError(err);

      // Log to console if enabled
      if (logToConsole) {
        console.error("Contract Error:", err);
        console.error("Parsed Error:", parsedError);
      }

      // Update state
      setError(err);
      setErrorMessage(parsedError.message);
      setErrorType(parsedError.name);
      setErrorCode(parsedError.code);

      // Show toast if enabled and not user rejection
      if (showToast && !parsedError.isUserRejection) {
        // Default implementation - can be overridden with a custom toast implementation
        console.error("Error:", parsedError.message);
        // In a real implementation, you would use your preferred toast library here
        // For example: toast.error(parsedError.message);
      }
    } catch (handlingError) {
      console.error("Error handling error:", handlingError);

      // Fallback error handling
      setError(err);
      setErrorMessage(fallbackMessage);
      setErrorType("HandlerError");

      if (showToast) {
        // Default implementation - can be overridden with a custom toast implementation
        console.error("Fallback Error:", fallbackMessage);
        // In a real implementation, you would use your preferred toast library here
        // For example: toast.error(fallbackMessage);
      }
    }
  };

  /**
   * Reset error state
   */
  const reset = (): void => {
    setError(null);
    setErrorMessage("");
    setErrorType("");
    setErrorCode(undefined);
  };

  /**
   * Create a wrapped async function with error handling
   * @param {Function} asyncFn - Async function yang akan di-wrap
   * @returns {Function} Wrapped function dengan error handling
   */
  const withErrorHandling = <T extends any[], R>(
    asyncFn: (...args: T) => Promise<R>
  ) => {
    return async (...args: T): Promise<R> => {
      try {
        reset();
        return await asyncFn(...args);
      } catch (err) {
        handleError(err);
        throw err; // Re-throw the error for further handling if needed
      }
    };
  };

  return {
    error,
    errorMessage,
    errorType,
    errorCode,
    hasError: error !== null,
    handleError,
    reset,
    withErrorHandling,
    parseContractError,
  };
};

/**
 * Hook khusus untuk menangani error transaksi dengan toast notification
 * @returns {Object} Objek yang berisi fungsi untuk handle error transaksi
 *
 * @example
 * const { handleTransactionError } = useTransactionErrorHandler();
 *
 * try {
 *   // Lakukan transaksi
 * } catch (err) {
 *   handleTransactionError(err, "Gagal melakukan transaksi");
 * }
 */
export const useTransactionErrorHandler = () => {
  const { handleError } = useErrorHandler({
    showToast: true,
    customMessages: {
      MancerFlow_Overdraw: "Jumlah penarikan melebihi batas yang tersedia",
      MancerFlow_Unauthorized:
        "Anda tidak memiliki izin untuk melakukan tindakan ini",
      MancerFlow_StreamNotPaused: "Stream tidak dalam status paused",
      MancerFlow_StreamPaused: "Stream dalam status paused",
      MancerFlow_StreamVoided: "Stream sudah dibatalkan",
      MancerFlow_WithdrawAmountZero: "Jumlah penarikan tidak boleh nol",
      MancerFlow_WithdrawToZeroAddress: "Alamat penarikan tidak valid",
      InsufficientFunds: "Saldo token tidak mencukupi",
      AllowanceBelowZero: "Jumlah allowance tidak mencukupi",
    },
  });

  /**
   * Handle error transaksi dengan custom message
   * @param {unknown} err - Error yang akan dihandle
   * @param {string} [customMessage] - Custom message untuk ditampilkan
   */
  const handleTransactionError = (
    err: unknown,
    customMessage?: string
  ): void => {
    if (customMessage) {
      // Default implementation - can be overridden with a custom toast implementation
      console.error("Transaction Error:", customMessage);
      // In a real implementation, you would use your preferred toast library here
      // For example: toast.error(customMessage);
    }
    handleError(err);
  };

  return {
    handleTransactionError,
  };
};
