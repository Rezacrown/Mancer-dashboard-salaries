"use client";

import { useState } from "react";
import { Hash } from "viem";

/**
 * Interface untuk transaksi toast options
 */
interface TransactionToastOptions {
  successMessage?: string;
  pendingMessage?: string;
  errorMessage?: string;
  txHash?: Hash;
  showTxLink?: boolean;
  duration?: number;
}

/**
 * Interface untuk toast state
 */
interface ToastState {
  isVisible: boolean;
  message: string;
  type: "success" | "error" | "pending" | "info";
  txHash?: Hash;
}

/**
 * Hook untuk menampilkan notifikasi transaksi
 * @returns {Object} Objek yang berisi fungsi dan state untuk menampilkan toast
 *
 * @example
 * const { showTransactionToast, showSuccessToast, showErrorToast, showPendingToast } = useTransactionToast();
 *
 * // Menampilkan toast untuk transaksi sukses
 * showSuccessToast("Transaksi berhasil", "0x123...abc");
 *
 * // Menampilkan toast untuk transaksi pending
 * showPendingToast("Menunggu konfirmasi...");
 *
 * // Menampilkan toast untuk transaksi error
 * showErrorToast("Transaksi gagal");
 */
export const useTransactionToast = () => {
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    message: "",
    type: "info",
  });

  /**
   * Menampilkan toast dengan opsi kustom
   * @param {string} message - Pesan yang akan ditampilkan
   * @param {"success" | "error" | "pending" | "info"} type - Tipe toast
   * @param {TransactionToastOptions} [options] - Opsi tambahan untuk toast
   * @param {number} [duration=3000] - Durasi toast dalam milidetik
   */
  const showToast = (
    message: string,
    type: "success" | "error" | "pending" | "info",
    options: TransactionToastOptions = {},
    duration: number = 3000
  ): void => {
    const { txHash, showTxLink = true } = options;

    // Set toast state
    setToast({
      isVisible: true,
      message,
      type,
      txHash: showTxLink ? txHash : undefined,
    });

    // Log ke console sebagai fallback
    console.log(
      `[${type.toUpperCase()}] ${message}${txHash ? ` - TX: ${txHash}` : ""}`
    );

    // Auto hide setelah duration
    setTimeout(() => {
      hideToast();
    }, duration);
  };

  /**
   * Menyembunyikan toast
   */
  const hideToast = (): void => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  /**
   * Menampilkan toast untuk transaksi sukses
   * @param {string} message - Pesan sukses
   * @param {Hash} [txHash] - Hash transaksi
   * @param {TransactionToastOptions} [options] - Opsi tambahan
   */
  const showSuccessToast = (
    message: string = "Transaksi berhasil",
    txHash?: Hash,
    options: TransactionToastOptions = {}
  ): void => {
    showToast(
      message,
      "success",
      { ...options, txHash },
      options.duration || 5000
    );
  };

  /**
   * Menampilkan toast untuk transaksi error
   * @param {string} message - Pesan error
   * @param {Hash} [txHash] - Hash transaksi
   * @param {TransactionToastOptions} [options] - Opsi tambahan
   */
  const showErrorToast = (
    message: string = "Transaksi gagal",
    txHash?: Hash,
    options: TransactionToastOptions = {}
  ): void => {
    showToast(
      message,
      "error",
      { ...options, txHash },
      options.duration || 5000
    );
  };

  /**
   * Menampilkan toast untuk transaksi pending
   * @param {string} message - Pesan pending
   * @param {Hash} [txHash] - Hash transaksi
   * @param {TransactionToastOptions} [options] - Opsi tambahan
   */
  const showPendingToast = (
    message: string = "Menunggu konfirmasi...",
    txHash?: Hash,
    options: TransactionToastOptions = {}
  ): void => {
    showToast(
      message,
      "pending",
      { ...options, txHash },
      options.duration || 0 // Tidak auto hide untuk pending
    );
  };

  /**
   * Menampilkan toast untuk informasi
   * @param {string} message - Pesan informasi
   * @param {TransactionToastOptions} [options] - Opsi tambahan
   */
  const showInfoToast = (
    message: string,
    options: TransactionToastOptions = {}
  ): void => {
    showToast(message, "info", options, options.duration || 3000);
  };

  /**
   * Menampilkan toast untuk transaksi dengan handling complete lifecycle
   * @param {Promise<any>} txPromise - Promise transaksi
   * @param {TransactionToastOptions} options - Opsi untuk toast
   * @returns {Promise<any>} Promise transaksi yang sama
   */
  const showTransactionLifecycle = async (
    txPromise: Promise<any>,
    options: TransactionToastOptions = {
      pendingMessage: "Memproses transaksi...",
      successMessage: "Transaksi berhasil",
      errorMessage: "Transaksi gagal",
    }
  ): Promise<any> => {
    try {
      // Tampilkan pending toast
      showPendingToast(options.pendingMessage || "Memproses transaksi...");

      // Tunggu transaksi selesai
      const result = await txPromise;

      // Dapatkan transaction hash jika ada
      const txHash = result?.hash as Hash;

      // Tampilkan success toast
      showSuccessToast(
        options.successMessage || "Transaksi berhasil",
        txHash,
        options
      );

      return result;
    } catch (error) {
      // Tampilkan error toast
      showErrorToast(
        options.errorMessage || "Transaksi gagal",
        undefined,
        options
      );
      throw error;
    }
  };

  /**
   * Membuat fungsi toast dengan pre-defined options
   * @param {TransactionToastOptions} defaultOptions - Opsi default
   * @returns {Object} Objek yang berisi fungsi toast dengan opsi default
   */
  const createToastHandlers = (
    defaultOptions: TransactionToastOptions = {}
  ) => {
    return {
      showSuccess: (
        message: string,
        txHash?: Hash,
        options?: TransactionToastOptions
      ) => showSuccessToast(message, txHash, { ...defaultOptions, ...options }),
      showError: (
        message: string,
        txHash?: Hash,
        options?: TransactionToastOptions
      ) => showErrorToast(message, txHash, { ...defaultOptions, ...options }),
      showPending: (
        message: string,
        txHash?: Hash,
        options?: TransactionToastOptions
      ) => showPendingToast(message, txHash, { ...defaultOptions, ...options }),
      showInfo: (message: string, options?: TransactionToastOptions) =>
        showInfoToast(message, { ...defaultOptions, ...options }),
      showTransaction: (
        txPromise: Promise<any>,
        options?: TransactionToastOptions
      ) =>
        showTransactionLifecycle(txPromise, { ...defaultOptions, ...options }),
    };
  };

  return {
    // State
    toast,

    // Basic functions
    showToast,
    hideToast,

    // Type-specific functions
    showSuccessToast,
    showErrorToast,
    showPendingToast,
    showInfoToast,

    // Advanced functions
    showTransactionLifecycle,
    createToastHandlers,
  };
};

/**
 * Hook khusus untuk transaksi streaming
 * @returns {Object} Objek yang berisi fungsi toast untuk transaksi streaming
 *
 * @example
 * const { showStreamCreated, showStreamUpdated, showStreamWithdrawn } = useStreamToast();
 *
 * // Menampilkan toast untuk stream created
 * showStreamCreated("Stream berhasil dibuat", txHash);
 */
export const useStreamToast = () => {
  const { createToastHandlers } = useTransactionToast();

  const streamToastHandlers = createToastHandlers({
    successMessage: "Operasi stream berhasil",
    pendingMessage: "Memproses stream...",
    errorMessage: "Operasi stream gagal",
  });

  /**
   * Menampilkan toast untuk stream created
   * @param {string} [message] - Pesan kustom
   * @param {Hash} [txHash] - Hash transaksi
   */
  const showStreamCreated = (message?: string, txHash?: Hash) => {
    streamToastHandlers.showSuccess(
      message || "Stream berhasil dibuat",
      txHash
    );
  };

  /**
   * Menampilkan toast untuk stream updated
   * @param {string} [message] - Pesan kustom
   * @param {Hash} [txHash] - Hash transaksi
   */
  const showStreamUpdated = (message?: string, txHash?: Hash) => {
    streamToastHandlers.showSuccess(
      message || "Stream berhasil diperbarui",
      txHash
    );
  };

  /**
   * Menampilkan toast untuk stream withdrawn
   * @param {string} [message] - Pesan kustom
   * @param {Hash} [txHash] - Hash transaksi
   */
  const showStreamWithdrawn = (message?: string, txHash?: Hash) => {
    streamToastHandlers.showSuccess(
      message || "Penarikan stream berhasil",
      txHash
    );
  };

  /**
   * Menampilkan toast untuk stream paused
   * @param {string} [message] - Pesan kustom
   * @param {Hash} [txHash] - Hash transaksi
   */
  const showStreamPaused = (message?: string, txHash?: Hash) => {
    streamToastHandlers.showSuccess(
      message || "Stream berhasil dijeda",
      txHash
    );
  };

  /**
   * Menampilkan toast untuk stream resumed
   * @param {string} [message] - Pesan kustom
   * @param {Hash} [txHash] - Hash transaksi
   */
  const showStreamResumed = (message?: string, txHash?: Hash) => {
    streamToastHandlers.showSuccess(
      message || "Stream berhasil dilanjutkan",
      txHash
    );
  };

  /**
   * Menampilkan toast untuk stream cancelled
   * @param {string} [message] - Pesan kustom
   * @param {Hash} [txHash] - Hash transaksi
   */
  const showStreamCancelled = (message?: string, txHash?: Hash) => {
    streamToastHandlers.showSuccess(
      message || "Stream berhasil dibatalkan",
      txHash
    );
  };

  return {
    showStreamCreated,
    showStreamUpdated,
    showStreamWithdrawn,
    showStreamPaused,
    showStreamResumed,
    showStreamCancelled,
    ...streamToastHandlers,
  };
};
