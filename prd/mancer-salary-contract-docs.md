# Mancer Flow Salary Contract Documentation

**Network:** Edu Chain Testnet

**Address:** `0x0fe44adB7854Cad8F11521e6D7C5eb5B7118EC0b`

**Type:** Salary Streaming (ERC-721 Stream NFT + Token Streaming System)

---

## Overview

The **Mancer Flow Salary Contract** manages salary streams on-chain.

Each salary stream is represented as an **NFT** and distributes tokens (like $PHII) over time to an employee.

Employers (senders) deposit funds, and employees (recipients) can withdraw the earned portion as time passes.

It also supports pausing, refunds, adjustable rates, and protocol fees.

---

## Core Concept

| Term                    | Description                                        |
| ----------------------- | -------------------------------------------------- |
| **Stream ID**           | Unique identifier (also the NFT token ID).         |
| **Sender**              | The employer who funds and manages the stream.     |
| **Recipient**           | The employee receiving streamed payments.          |
| **Rate per Second**     | The rate at which salary accrues (UD21x18 format). |
| **Protocol Fee**        | Fee fraction taken by Mancer protocol.             |
| **Balance**             | Remaining tokens deposited in the stream.          |
| **Withdrawable Amount** | Amount recipient can claim right now.              |

---

## Data Types

- **UD21x18**: Fixed-point number with 18 decimals (used for rate per second).
- **UD60x18**: Fixed-point number with 18 decimals (used for fees).
- **uint128**: Token amounts, safe for standard ERC-20 balances.

Always convert to human-readable format using token decimals (e.g., via `formatUnits()` in frontend).

---

## Key Features

✅ Real-time salary accrual (streaming per second)

✅ ERC-721 ownership of streams (transferable if allowed)

✅ Adjustable rate and pausing capability

✅ Refundable unused balance for sender

✅ Protocol fee revenue system

✅ Multi-call batching for UX efficiency

---

## Contract Roles

| Role          | Description                            | Key Functions                                                |     |
| ------------- | -------------------------------------- | ------------------------------------------------------------ | --- |
| **Admin**     | Sets protocol fees, collects revenue   | `setProtocolFee`, `collectProtocolRevenue`, `transferAdmin`  |     |
| **Sender**    | Employer who creates and funds streams | `createAndDeposit`, `pause`, `refund`, `adjustRatePerSecond` |     |
| **Recipient** | Employee who receives salary           | `withdraw`, `withdrawMax`                                    |     |

---

## Salary Stream Lifecycle

1. **Create Stream** → `create()` or `createAndDeposit()`
2. **Deposit Tokens** → `deposit()` or `depositViaBroker()`
3. **Recipient Withdraws** → `withdraw()` or `withdrawMax()`
4. **Sender Refunds or Pauses** → `refund()` or `pause()`
5. **Adjust Rate / Restart** → `adjustRatePerSecond()` or `restart()`
6. **Void Stream** → `void()` (end permanently)

---

## Read Functions (Frontend)

Use these for **displaying stream data**, **balances**, and **status**.

### 🎯 Stream Information

| Function                     | Description                  | Returns                                                    |     |
| ---------------------------- | ---------------------------- | ---------------------------------------------------------- | --- |
| `getStream(streamId)`        | Full stream object           | All stream properties (balance, rate, sender, token, etc.) |     |
| `getSender(streamId)`        | Sender (employer) address    | `address`                                                  |     |
| `getRecipient(streamId)`     | Recipient (employee) address | `address`                                                  |     |
| `getToken(streamId)`         | ERC-20 token used            | `address`                                                  |     |
| `getRatePerSecond(streamId)` | Stream accrual rate          | `uint256 (UD21x18)`                                        |     |
| `getTokenDecimals(streamId)` | Token decimals               | `uint8`                                                    |     |

### 💰 Balance & Withdrawal

| Function                         | Description                    | Returns   |     |
| -------------------------------- | ------------------------------ | --------- | --- |
| `getBalance(streamId)`           | Deposited balance left         | `uint128` |     |
| `withdrawableAmountOf(streamId)` | How much recipient can claim   | `uint128` |     |
| `refundableAmountOf(streamId)`   | Refundable portion for sender  | `uint128` |     |
| `depletionTimeOf(streamId)`      | Timestamp when stream depletes | `uint256` |     |

### ⚙️ Status & Flags

| Function                   | Description           | Returns |
| -------------------------- | --------------------- | ------- |
| `statusOf(streamId)`       | Current status enum   | `uint8` |
| `isPaused(streamId)`       | Whether paused        | `bool`  |
| `isVoided(streamId)`       | Whether terminated    | `bool`  |
| `isTransferable(streamId)` | Transferable NFT flag | `bool`  |

---

## Write Functions (Transactions)

Use these for **interacting** with the contract through wallet (MetaMask, OKX Wallet, etc.).

### 🏗️ Creation & Funding

| Function                                                                          | Description                  | Access       | Payable |
| --------------------------------------------------------------------------------- | ---------------------------- | ------------ | ------- |
| `create(sender, recipient, ratePerSecond, token, transferable)`                   | Create new stream NFT        | Sender/Admin | ✅      |
| `createAndDeposit(sender, recipient, ratePerSecond, token, transferable, amount)` | Create and fund in one tx    | Sender/Admin | ✅      |
| `deposit(streamId, amount, sender, recipient)`                                    | Add funds to existing stream | Sender       | ✅      |
| `depositViaBroker(streamId, totalAmount, sender, recipient, broker)`              | Deposit with broker fee      | Sender       | ✅      |

---

### 💵 Withdrawals

| Function                         | Description                  | Access    | Payable |
| -------------------------------- | ---------------------------- | --------- | ------- |
| `withdraw(streamId, to, amount)` | Withdraw custom amount       | Recipient | ✅      |
| `withdrawMax(streamId, to)`      | Withdraw all available funds | Recipient | ✅      |

---

### 💸 Refunds

| Function                   | Description                  | Access |
| -------------------------- | ---------------------------- | ------ |
| `refund(streamId, amount)` | Refund partial balance       | Sender |
| `refundMax(streamId)`      | Refund all refundable tokens | Sender |

---

### ⏸️ Control & Adjustment

| Function                                          | Description                  | Access       |
| ------------------------------------------------- | ---------------------------- | ------------ |
| `pause(streamId)`                                 | Pause salary accrual         | Sender       |
| `restart(streamId, newRatePerSecond)`             | Resume with new rate         | Sender       |
| `adjustRatePerSecond(streamId, newRatePerSecond)` | Adjust rate on active stream | Sender       |
| `void(streamId)`                                  | Permanently end stream       | Sender/Admin |

---

### ⚙️ Admin Management

| Function                            | Description                | Access |
| ----------------------------------- | -------------------------- | ------ |
| `setProtocolFee(token, newFee)`     | Set protocol fee (UD60x18) | Admin  |
| `collectProtocolRevenue(token, to)` | Withdraw protocol revenue  | Admin  |
| `transferAdmin(newAdmin)`           | Change admin address       | Admin  |

---

## 🔍 ERC-721 Functions (Stream as NFT)

- `ownerOf(streamId)` → Current owner of stream NFT
- `transferFrom(from, to, streamId)` → Transfer ownership (if transferable)
- `approve(address, streamId)` and `setApprovalForAll(operator, approved)`
- `tokenURI(streamId)` → Stream metadata (on-chain descriptor)

---

## Events to Track (for DApp History UI)

| Event                                      | Description               |
| ------------------------------------------ | ------------------------- |
| `CreateFlowStream`                         | New stream created        |
| `DepositFlowStream`                        | Additional deposit made   |
| `WithdrawFromFlowStream`                   | Employee withdraws salary |
| `PauseFlowStream`                          | Stream paused             |
| `RestartFlowStream`                        | Stream resumed            |
| `AdjustFlowStream`                         | Rate updated              |
| `RefundFromFlowStream`                     | Employer refund processed |
| `VoidFlowStream`                           | Stream terminated         |
| `SetProtocolFee`, `CollectProtocolRevenue` | Admin-level events        |
| `Transfer`                                 | NFT ownership change      |

Use these events to build an **Activity Timeline** in the frontend.

---

## 🧮 Example Integration (wagmi v2)

### Get Stream Data

```tsx
import { useReadContract } from "wagmi";

const { data: stream } = useReadContract({
  address: "0x0fe44adB7854Cad8F11521e6D7C5eb5B7118EC0b",
  abi,
  functionName: "getStream",
  args: [streamId],
});
```

### Withdraw Salary

```tsx
import { useWriteContract } from "wagmi";

writeContract({
  address: "0x0fe44adB7854Cad8F11521e6D7C5eb5B7118EC0b",
  abi,
  functionName: "withdrawMax",
  args: [streamId, userAddress],
});
```

---

## 🧩 UI Tips & Best Practices

✅ Always format tokens with `formatUnits(value, tokenDecimals)`

✅ Handle `paused`, `voided`, and `transferable` flags in UI logic

✅ Show live accrued salary by recalculating `withdrawableAmountOf` periodically

✅ Show estimated protocol fee next to withdrawal amount

✅ Map revert messages to friendly errors:

- `Overdraw` → “You tried to withdraw more than available.”
- `StreamPaused` → “This stream is currently paused.”
- `StreamVoided` → “Stream has ended.”
