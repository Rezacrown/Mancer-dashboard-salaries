# Dokumentasi Implementasi Hook untuk Halaman Employee (/me)

## Ringkasan

Dokumentasi ini menjelaskan rencana implementasi hook/service untuk halaman Employee (/me) berdasarkan analisis ABI dan dokumentasi Mancer Salary Contract.

## Konteks Proyek

- **Framework**: Next.js 16, Wagmi v2, dan Viem
- **Smart Contract Salary**: `0x0fe44adB7854Cad8F11521e6D7C5eb5B7118EC0b`
- **Token PHII**: `0xc6800342F5C0895dd4419B99Bf758b2136F1CAfe`
- **Lokasi Hook**: `src/libs/services/employee/`

## Hook yang akan Diimplementasikan

### 1. useGetEmployeeStreams

**Tujuan**: Mendapatkan semua stream dimana connected wallet adalah recipient

**Fungsi Contract yang Digunakan**:

- Event `CreateFlowStream` untuk mencari stream berdasarkan recipient address

**Parameter Input**:

- `address: Address` - Alamat wallet yang terhubung

**Return Value**:

```typescript
{
  streams: EmployeeStream[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface EmployeeStream {
  streamId: bigint;
  sender: Address;
  recipient: Address;
  ratePerSecond: bigint;
  token: Address;
  transferable: boolean;
}
```

**Implementasi**:

- Menggunakan `usePublicClient` dari Wagmi untuk mengambil event logs
- Filter event `CreateFlowStream` dengan args `recipient` = connected wallet address
- Auto-refresh setiap 30 detik untuk update real-time

### 2. useEmployeeStreamDetail

**Tujuan**: Mendapatkan detail stream untuk employee

**Fungsi Contract yang Digunakan**:

- `getStream(streamId)` - Mendapatkan data stream lengkap
- `withdrawableAmountOf(streamId)` - Mendapatkan jumlah yang dapat ditarik
- `getBalance(streamId)` - Mendapatkan sisa balance stream
- `statusOf(streamId)` - Mendapatkan status stream
- `isPaused(streamId)` - Mengecek apakah stream di-pause
- `isVoided(streamId)` - Mengecek apakah stream sudah di-void

**Parameter Input**:

- `streamId: bigint` - ID stream yang akan dicek detailnya

**Return Value**:

```typescript
{
  streamDetail: StreamDetail | null;
  withdrawableAmount: bigint | null;
  balance: bigint | null;
  status: number | null;
  isPaused: boolean | null;
  isVoided: boolean | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface StreamDetail {
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
```

**Implementasi**:

- Menggunakan `useReadContract` dari Wagmi untuk membaca data dari smart contract
- Multiple contract calls untuk mendapatkan semua informasi yang diperlukan
- Format nilai menggunakan `formatUnits` dari Viem untuk tampilan yang readable

### 3. useWithdrawSalary

**Tujuan**: Menarik salary dari stream

**Fungsi Contract yang Digunakan**:

- `withdrawMax(streamId, to)` - Menarik semua jumlah yang tersedia
- `withdraw(streamId, to, amount)` - Menarik jumlah tertentu

**Parameter Input**:

- `streamId: bigint` - ID stream yang akan ditarik
- `to?: Address` - Alamat tujuan penarikan (optional, default ke connected wallet)

**Return Value**:

```typescript
{
  withdraw: (amount?: bigint) => Promise<void>;
  withdrawMax: () => Promise<void>;
  isWithdrawing: boolean;
  isSuccess: boolean;
  error: Error | null;
  reset: () => void;
}
```

**Implementasi**:

- Menggunakan `useWriteContract` dan `useWaitForTransactionReceipt` dari Wagmi
- Error handling untuk kasus-kasus seperti:
  - `MancerFlow_Overdraw` - "Anda mencoba menarik lebih dari yang tersedia"
  - `MancerFlow_StreamPaused` - "Stream ini sedang di-pause"
  - `MancerFlow_StreamVoided` - "Stream sudah berakhir"
- Loading states untuk UX yang baik
- Reset state setelah transaksi selesai

### 4. useEmployeeWalletBalance (Review & Enhancement)

**Tujuan**: Mendapatkan saldo wallet untuk berbagai token

**Fungsi Contract yang Digunakan**:

- `balanceOf` dari ERC20 contract untuk setiap token (ETH, PHII, USDT)

**Parameter Input**:

- `address: Address` - Alamat wallet yang akan dicek saldonya

**Return Value**:

```typescript
{
  balances: WalletAsset[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface WalletAsset {
  symbol: string;
  balance: string;
  address: Address;
  decimals: number;
}
```

**Enhancement yang Diperlukan**:

- Menambahkan informasi token address dan decimals
- Menambahkan loading state untuk setiap token
- Error handling yang lebih baik
- Refetch functionality

### 5. useEmployeeRecentTransactions (Review & Enhancement)

**Tujuan**: Mendapatkan riwayat transaksi terakhir

**Fungsi Contract yang Digunakan**:

- Event `WithdrawFromFlowStream` untuk transaksi withdraw
- Event `CreateFlowStream` untuk transaksi stream baru
- Event `PauseFlowStream` untuk stream yang di-pause
- Event `RestartFlowStream` untuk stream yang di-restart

**Parameter Input**:

- `address: Address` - Alamat wallet yang akan dicek transaksinya

**Return Value**:

```typescript
{
  transactions: TransactionHistory[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

type TransactionHistory = {
  type: "Withdraw" | "Stream Started" | "Stream Paused" | "Stream Restarted" | "Stream Voided";
  hash: string;
  blockNumber: bigint;
  amount?: string;
  token?: Address;
  timestamp?: number;
  rawAmount: bigint;
  streamId?: bigint;
  sender?: Address;
};
```

**Enhancement yang Diperlukan**:

- Menambahkan lebih banyak jenis event (Pause, Restart, Void)
- Menambahkan informasi stream ID dan sender
- Menambahkan timestamp dengan fetch block data
- Optimasi query dengan fromBlock yang lebih spesifik

## Ekspor Semua Hook

Semua hook akan diekspor dari `src/libs/services/employee/index.ts`:

```typescript
export { useGetEmployeeStreams } from "./useGetEmployeeStreams";
export { useEmployeeStreamDetail } from "./useEmployeeStreamDetail";
export { useWithdrawSalary } from "./useWithdrawSalary";
export { useGetEmployeeWalletBalance } from "./useGetEmployeeWalletBalance";
export { useGetRecentTransactions } from "./useGetRecentTransactions";
export { useGetTokenSysmbol } from "./useGetTokenSymbol";
export { useGetStreamsRecepientId } from "./useGetStreamsRecepientId";
export { useGetEmployeeStream } from "./useGetEmployeeStream";

// Re-export types
export type { TransactionHistory } from "./useGetRecentTransactions";
export type { WalletAsset } from "./useGetEmployeeWalletBalance";
export type { EmployeeStream } from "./useGetEmployeeStreams";
export type { StreamDetail } from "./useEmployeeStreamDetail";
```

## Best Practices

1. **Error Handling**: Setiap hook memiliki error handling yang baik dengan pesan yang user-friendly
2. **Loading States**: Setiap hook menunjukkan loading state untuk UX yang baik
3. **Type Safety**: Menggunakan TypeScript interfaces yang ketat
4. **Real-time Updates**: Auto-refresh data untuk informasi yang berubah secara real-time
5. **Performance**: Menggunakan staleTime dan query options yang optimal
6. **Consistency**: Konsisten dalam penamaan dan struktur return value

## Dependencies

- Wagmi v2 untuk integrasi dengan smart contract
- Viem untuk utility functions (formatUnits, parseAbiItem, etc.)
- React hooks (useEffect, useState, useCallback)
