# Frontend DApp Developer

**Goal:**

Build a salary dashboard DApp for Mancer that connects to existing smart contracts.

**Reference Contracts:**

- Salary Contract: [`0x0fe44adB7854Cad8F11521e6D7C5eb5B7118EC0b`](https://edu-chain-testnet.blockscout.com/address/0x0fe44adB7854Cad8F11521e6D7C5eb5B7118EC0b)
  [Mancer Flow Salary Contract Documentation](./mancer-salary-prd.md)
- Phii Coin (ERC-20): `0xc6800342F5C0895dd4419b99Bf758b2136F1CAfe`
  - Send your **Ethereum public wallet address** to **JO** so we can transfer your **Phii Coins**.
  - Token PHII abi
    [abi-token-phii.json](abi-token-phii.json)

**Tech Stack:**

- Frontend: **Next.js 16 (App Router) + TailwindCSS + Wagmi + RainbowKit**
- Backend (optional): **Express.js / Node.js**
- Chain: **Edu Chain Testnet**
- Wallet: **MetaMask or OKX Wallet**

**Core Requirements:**

- Connect wallet and display user balance (Phii Coin)
- Show salary distribution data from the salary contract
- Enable admin to simulate "Send & withdraw Salary" transactions
- Display transaction history (from block explorer API or on-chain logs)
- Build responsive UI with Mancer branding (red theme #F9140D)

**Must-have pages:**

1. Employer

- `/employer/streams` list all streams the connected wallet is **sender** of
  • columns: StreamID, Recipient, Token, Rate/sec, Balance, Status, Actions
- `/employer/create` create & deposit a stream
  • fields: recipient, token address, rate/sec (human input → per-second UD21x18), transferable flag, initial deposit
- `/employer/stream/[id]` stream detail
  • actions: Deposit, Pause, Restart (new rate), Adjust Rate, Refund, Refund Max, Void
  • show: withdrawable, refundable, depletion time, protocol fee, full event timeline

1. Employee

- `/me` dashboard for **recipient** wallet
  • list streams where connected wallet is recipient
  • actions per stream: Withdraw (custom), Withdraw Max
  • show: withdrawable, last paid, status badges (Active, Paused, Voided), token decimals formatting

**Bonus (Extra XP):**

- Add role-based access (Admin / Employee)
- Integrate Firebase or Supabase for user profiles and database

**Deliverables:**

- `/src` folder with clean, modular code
- `.env.example` with safe config structure
- `/docs/system-design.md` — architecture diagram and flow description
- `README.md` — setup, commands, and deployment steps
