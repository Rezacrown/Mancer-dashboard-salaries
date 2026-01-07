// --- Dummy Data ---
export const USER_PROFILE = {
  name: "Melinda Aulia",
  address: "0x8Df44cbEae7E9227DE84947d9C350b18A1b5a04b",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Melinda",
};

export const EMPLOYEE_STREAM_DATA = {
  id: "FL-11155111-89",
  sender: "0xA1B2...C3D4E5",
  recipient: "0xGf4D...u98Lp5",
  token: "USDT",
  ratePerMonth: 20000,
  status: "Active",
  chain: "Edu Chain Testnet",
  startTime: new Date("2024-01-01").getTime(),
};

// Data for Employer View
export const INITIAL_STREAMS = [
  {
    id: "FL-101",
    recipient: "0xUn1...9281",
    name: "Budi Santoso",
    token: "PHII",
    ratePerMonth: 5000,
    balance: 1200,
    status: "Active",
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).getTime(), // 15 days ago
    events: [
      { type: "Create", date: "15 days ago", desc: "Stream created" },
      { type: "Deposit", date: "15 days ago", desc: "Deposited 2500 PHII" },
      { type: "Withdraw", date: "1 week ago", desc: "Withdrew 500 PHII" },
    ],
  },
  {
    id: "FL-102",
    recipient: "0xWa2...1122",
    name: "Siti Aminah",
    token: "USDT",
    ratePerMonth: 7500,
    balance: 3400,
    status: "Active",
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).getTime(), // 30 days ago
    events: [
      { type: "Create", date: "1 month ago", desc: "Stream created" },
      { type: "Deposit", date: "1 month ago", desc: "Deposited 7500 USDT" },
    ],
  },
  {
    id: "FL-103",
    recipient: "0xQr5...5512",
    name: "Joko Anwar",
    token: "PHII",
    ratePerMonth: 4800,
    balance: 100,
    status: "Paused",
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).getTime(), // 60 days ago
    events: [
      { type: "Create", date: "2 months ago", desc: "Stream created" },
      { type: "Pause", date: "2 days ago", desc: "Stream paused by sender" },
    ],
  },
  {
    id: "FL-104",
    recipient: "0xTr9...9911",
    name: "Rina Nose",
    token: "USDT",
    ratePerMonth: 6000,
    balance: 0,
    status: "Voided",
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).getTime(), // 90 days ago
    events: [
      { type: "Create", date: "3 months ago", desc: "Stream created" },
      { type: "Void", date: "1 month ago", desc: "Stream voided and refunded" },
    ],
  },
];

export const TRANSACTIONS = [
  {
    id: 1,
    type: "Withdraw",
    entity: "PT. BANK JAGO Tbk",
    date: "2 weeks ago",
    amount: "- Rp 6.740.150 IDR",
    icon: "bank",
  },
  {
    id: 2,
    type: "Received",
    entity: "Delta - Delta Corporation",
    date: "31 Jan",
    amount: "+ 567 PHII",
    icon: "crypto",
  },
  {
    id: 3,
    type: "Received",
    entity: "Delta - Delta Corporation",
    date: "15 Dec 2024",
    amount: "+ 567 PHII",
    icon: "crypto",
  },
];

export const WALLET_ASSETS = [
  {
    symbol: "ETH",
    balance: "0.0017",
    value: "$5.50",
    change: "+32.8%",
    isUp: true,
  },
  {
    symbol: "PHII",
    balance: "1,250.00",
    value: "$1,250.00",
    change: "+0.0%",
    isUp: true,
  },
  {
    symbol: "APL",
    balance: "0.0017",
    value: "$5.59",
    change: "-2.5%",
    isUp: false,
  },
];
