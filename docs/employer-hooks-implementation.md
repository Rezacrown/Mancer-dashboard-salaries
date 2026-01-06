# Dokumentasi Implementasi Hook untuk Halaman Employer

## Ringkasan

Dokumentasi ini menjelaskan rencana implementasi hook/service untuk halaman Employer berdasarkan analisis ABI dan dokumentasi Mancer Salary Contract.

## Konteks Proyek

- **Framework**: Next.js 16, Wagmi v2, dan Viem
- **Smart Contract Salary**: `0x0fe44adB7854Cad8F11521e6D7C5eb5B7118EC0b`
- **Token PHII**: `0xc6800342F5C0895dd4419B99Bf758b2136F1CAfe`
- **Lokasi Hook**: `src/libs/services/employer/`

## Hook yang akan Diimplementasikan

### 1. useGetEmployerStreams

**Tujuan**: Mendapatkan semua stream dimana connected wallet adalah sender (employer)

**Fungsi Contract yang Digunakan**:

- Event `CreateFlowStream` untuk mencari stream berdasarkan sender address

**Parameter Input**:

- `address: Address` - Alamat wallet yang terhubung (employer)

**Return Value**:

```typescript
{
  streams: EmployerStream[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface EmployerStream {
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
- Filter event `CreateFlowStream` dengan args `sender` = connected wallet address
- Auto-refresh setiap 30 detik untuk update real-time

### 2. useEmployerStreamDetail

**Tujuan**: Mendapatkan detail stream untuk employer

**Fungsi Contract yang Digunakan**:

- `getStream(streamId)` - Mendapatkan data stream lengkap
- `withdrawableAmountOf(streamId)` - Mendapatkan jumlah yang dapat ditarik oleh employee
- `getBalance(streamId)` - Mendapatkan sisa balance stream
- `refundableAmountOf(streamId)` - Mendapatkan jumlah yang dapat di-refund oleh employer
- `depletionTimeOf(streamId)` - Mendapatkan estimasi waktu habisnya stream
- `statusOf(streamId)` - Mendapatkan status stream
- `isPaused(streamId)` - Mengecek apakah stream di-pause
- `isVoided(streamId)` - Mengecek apakah stream sudah di-void
- `getRecipient(streamId)` - Mendapatkan alamat recipient
- `getRatePerSecond(streamId)` - Mendapatkan rate per second
- `getToken(streamId)` - Mendapatkan alamat token
- `getTokenDecimals(streamId)` - Mendapatkan decimals token

**Parameter Input**:

- `streamId: bigint` - ID stream yang akan dicek detailnya

**Return Value**:

```typescript
{
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
- Hitung estimasi waktu habis berdasarkan depletion time

### 3. useCreateStream

**Tujuan**: Membuat stream baru untuk employee

**Fungsi Contract yang Digunakan**:

- `create(sender, recipient, ratePerSecond, token, transferable)` - Membuat stream baru
- `createAndDeposit(sender, recipient, ratePerSecond, token, transferable, amount)` - Membuat dan deposit dalam satu transaksi

**Parameter Input**:

- `recipient: Address` - Alamat wallet employee
- `ratePerSecond: bigint` - Rate per second dalam UD21x18 format
- `token: Address` - Alamat token yang digunakan
- `transferable: boolean` - Apakah stream dapat ditransfer
- `amount?: bigint` - Jumlah deposit awal (optional)

**Return Value**:

```typescript
{
  createStream: (params: CreateStreamParams) => Promise<void>;
  createAndDepositStream: (params: CreateAndDepositStreamParams) => Promise<void>;
  isCreating: boolean;
  isSuccess: boolean;
  error: Error | null;
  reset: () => void;
}

interface CreateStreamParams {
  recipient: Address;
  ratePerSecond: bigint;
  token: Address;
  transferable: boolean;
}

interface CreateAndDepositStreamParams extends CreateStreamParams {
  amount: bigint;
}
```

**Implementasi**:

- Menggunakan `useWriteContract` dan `useWaitForTransactionReceipt` dari Wagmi
- Error handling untuk kasus-kasus seperti:
  - `MancerFlow_SenderZeroAddress` - "Alamat sender tidak valid"
  - `MancerFlow_InvalidTokenDecimals` - "Token decimals tidak valid"
- Loading states untuk UX yang baik
- Return stream ID yang baru dibuat

### 4. useDepositStream

**Tujuan**: Menambahkan dana ke stream yang sudah ada

**Fungsi Contract yang Digunakan**:

- `deposit(streamId, amount, sender, recipient)` - Deposit tambahan dana
- `depositViaBroker(streamId, totalAmount, sender, recipient, broker)` - Deposit dengan broker

**Parameter Input**:

- `streamId: bigint` - ID stream yang akan ditambah dananya
- `amount: bigint` - Jumlah yang akan dideposit

**Return Value**:

```typescript
{
  deposit: (amount: bigint) => Promise<void>;
  depositViaBroker: (amount: bigint, broker: Broker) => Promise<void>;
  isDepositing: boolean;
  isSuccess: boolean;
  error: Error | null;
  reset: () => void;
}

interface Broker {
  account: Address;
  fee: bigint;
}
```

**Implementasi**:

- Menggunakan `useWriteContract` dari Wagmi
- Validasi stream ID dan amount
- Error handling untuk error spesifik deposit
- Loading states dan reset functionality

### 5. useManageStream

**Tujuan**: Mengelola stream (pause, restart, adjust rate, void, refund)

**Fungsi Contract yang Digunakan**:

- `pause(streamId)` - Pause stream
- `restart(streamId, newRatePerSecond)` - Restart stream dengan rate baru
- `adjustRatePerSecond(streamId, newRatePerSecond)` - Adjust rate stream
- `void(streamId)` - Void stream (akhiri permanen)
- `refund(streamId, amount)` - Refund sebagian dana
- `refundMax(streamId)` - Refund semua dana yang bisa di-refund
- `refundAndPause(streamId, amount)` - Refund dan pause stream

**Parameter Input**:

- `streamId: bigint` - ID stream yang akan dikelola
- `newRatePerSecond?: bigint` - Rate baru untuk restart/adjust (optional)
- `amount?: bigint` - Jumlah untuk refund (optional)

**Return Value**:

```typescript
{
  pauseStream: () => Promise<void>;
  restartStream: (newRatePerSecond?: bigint) => Promise<void>;
  adjustRate: (newRatePerSecond: bigint) => Promise<void>;
  voidStream: () => Promise<void>;
  refund: (amount?: bigint) => Promise<void>;
  refundMax: () => Promise<void>;
  refundAndPause: (amount?: bigint) => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
  error: Error | null;
  reset: () => void;
}
```

**Implementasi**:

- Menggunakan `useWriteContract` dari Wagmi
- Error handling untuk kasus-kasus seperti:
  - `MancerFlow_StreamPaused` - "Stream sudah di-pause"
  - `MancerFlow_StreamNotPaused` - "Stream tidak di-pause"
  - `MancerFlow_StreamVoided` - "Stream sudah di-void"
  - `MancerFlow_RatePerSecondNotDifferent` - "Rate per second tidak berbeda"
  - `MancerFlow_RefundAmountZero` - "Jumlah refund tidak valid"
- Loading states untuk setiap operasi
- Confirmation dialog untuk operasi krusial (void, refund)

### 6. useEmployerTransactions

**Tujuan**: Mendapatkan riwayat transaksi terakhir untuk employer

**Fungsi Contract yang Digunakan**:

- Event `CreateFlowStream` untuk stream baru
- Event `DepositFlowStream` untuk deposit tambahan
- Event `AdjustFlowStream` untuk adjust rate
- Event `PauseFlowStream` untuk stream yang di-pause
- Event `RestartFlowStream` untuk stream yang di-restart
- Event `RefundFromFlowStream` untuk refund
- Event `VoidFlowStream` untuk stream yang di-void

**Parameter Input**:

- `address: Address` - Alamat wallet employer

**Return Value**:

```typescript
{
  transactions: EmployerTransaction[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

type EmployerTransaction = {
  type: "Stream Created" | "Deposit" | "Adjust Rate" | "Stream Paused" | "Stream Restarted" | "Refund" | "Stream Voided";
  hash: string;
  blockNumber: bigint;
  amount?: string;
  token?: Address;
  timestamp?: number;
  rawAmount: bigint;
  streamId: bigint;
  recipient?: Address;
  oldRatePerSecond?: bigint;
  newRatePerSecond?: bigint;
};
```

**Implementasi**:

- Menggunakan `usePublicClient` untuk mengambil event logs
- Filter events berdasarkan sender address
- Mapping data ke format yang konsisten
- Pagination untuk jumlah transaksi yang banyak
- Auto-refresh untuk update real-time

### 7. useEmployerStats

**Tujuan**: Mendapatkan statistik employer (total streams, total active streams, total value locked, dll)

**Fungsi Contract yang Digunakan**:

- `balanceOf` dari ERC20 untuk total balance
- `aggregateBalance` dari salary contract
- Kalkulasi manual berdasarkan data streams

**Parameter Input**:

- `address: Address` - Alamat wallet employer

**Return Value**:

```typescript
{
  stats: EmployerStats;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface EmployerStats {
  totalStreams: number;
  activeStreams: number;
  pausedStreams: number;
  voidedStreams: number;
  totalValueLocked: string;
  totalDeposited: string;
  totalWithdrawn: string;
  totalRefunded: string;
  monthlyPayout: string;
}
```

**Implementasi**:

- Kombinasi dari contract calls dan kalkulasi client-side
- Menggunakan data dari `useGetEmployerStreams` untuk perhitungan
- Format nilai menggunakan `formatUnits`
- Auto-update ketika ada perubahan data stream

## Ekspor Semua Hook

Semua hook akan diekspor dari `src/libs/services/employer/index.ts`:

```typescript
export { useGetEmployerStreams } from "./useGetEmployerStreams";
export { useEmployerStreamDetail } from "./useEmployerStreamDetail";
export { useCreateStream } from "./useCreateStream";
export { useDepositStream } from "./useDepositStream";
export { useManageStream } from "./useManageStream";
export { useEmployerTransactions } from "./useEmployerTransactions";
export { useEmployerStats } from "./useEmployerStats";

// Re-export types
export type { EmployerStream } from "./useGetEmployerStreams";
export type { StreamDetail } from "./useEmployerStreamDetail";
export type { EmployerTransaction } from "./useEmployerTransactions";
export type { EmployerStats } from "./useEmployerStats";
export type {
  CreateStreamParams,
  CreateAndDepositStreamParams,
} from "./useCreateStream";
export type { Broker } from "./useDepositStream";
```

## Best Practices

1. **Error Handling**: Setiap hook memiliki error handling yang baik dengan pesan yang user-friendly
2. **Loading States**: Setiap hook menunjukkan loading state untuk UX yang baik
3. **Type Safety**: Menggunakan TypeScript interfaces yang ketat
4. **Real-time Updates**: Auto-refresh data untuk informasi yang berubah secara real-time
5. **Performance**: Menggunakan staleTime dan query options yang optimal
6. **Consistency**: Konsisten dalam penamaan dan struktur return value
7. **Security**: Validasi input dan parameter sebelum melakukan contract call
8. **Gas Optimization**: Batch multiple calls jika memungkinkan

## Dependencies

- Wagmi v2 untuk integrasi dengan smart contract
- Viem untuk utility functions (formatUnits, parseAbiItem, etc.)
- React hooks (useEffect, useState, useCallback)
