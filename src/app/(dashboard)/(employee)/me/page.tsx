"use client";
import Badge from "@/components/shared/Badge";
import Card from "@/components/shared/Card";
import {
  ArrowDownLeft,
  Briefcase,
  ChevronDown,
  Coins,
  Copy,
  FileText,
  Wallet,
} from "lucide-react";
import { useState } from "react";

import {
  USER_PROFILE,
  EMPLOYEE_STREAM_DATA,
  TRANSACTIONS,
  WALLET_ASSETS,
} from "@/constants/Mock";
import { useGetAuthenticated } from "@/libs/hooks/useGetAuthenticated";
import { formatAddress } from "@/libs/utils";

const EmployeeDashboardPage = () => {
  const { address, openAccountModal } = useGetAuthenticated();

  const [streamedBalance, setStreamedBalance] = useState(11377.68);
  const [withdrawable, setWithdrawable] = useState(11120.92);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Title */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          My Salary Dashboard
        </h1>
        <button
          onClick={openAccountModal}
          className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 hover:border-primary hover:text-primary transition-all"
        >
          <span>{address && formatAddress(address)}</span>
          <ChevronDown
            className="hover:text-primary transition-all"
            size={16}
          />
        </button>
      </div>

      {/* Top Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gauge Card */}
        <Card className="lg:col-span-1 relative overflow-hidden flex flex-col justify-between">
          <div className="text-center mt-4 mb-6">
            <div className="relative w-48 h-48 mx-auto">
              <svg className="w-full h-full transform rotate-135">
                <circle
                  cx="50%"
                  cy="50%"
                  r="40%"
                  stroke="#f3f4f6"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray="251 251"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="40%"
                  stroke="#F9140D"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray="180 251"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white mb-2 shadow-md">
                  <span className="font-bold text-xs">T</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {streamedBalance.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h2>
                <span className="text-xs font-semibold text-gray-400 uppercase">
                  USDT
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  Salary 20K USDT / Month
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-[#F9140D]">
                  <Briefcase size={16} />
                </div>
                <div className="text-xs">
                  <p className="font-semibold">Employee Contract Mantle</p>
                </div>
              </div>
              <Badge status="Active" />
            </div>

            <button className="w-full py-3 bg-[#F9140D] hover:bg-red-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-200 active:scale-95">
              Withdraw
            </button>
            <button className="w-full py-3 bg-white border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
              <FileText size={16} /> View the contract
            </button>
          </div>
        </Card>

        {/* Accounting & Overview */}
        <div className="lg:col-span-2 grid grid-cols-1 gap-6">
          <Card>
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-semibold text-gray-700">Accounting</h3>
              <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white">
                <span className="font-bold text-sm">T</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1 h-4 bg-yellow-400 rounded-full"></div>
                  <span className="text-xs text-gray-500 uppercase font-medium">
                    Net Deposits
                  </span>
                </div>
                <p className="text-lg font-bold">
                  20,000{" "}
                  <span className="text-xs text-gray-400 font-normal">
                    USDT
                  </span>
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1 h-4 bg-red-400 rounded-full"></div>
                  <span className="text-xs text-gray-500 uppercase font-medium">
                    Debt (Remaining)
                  </span>
                </div>
                <p className="text-lg font-bold">
                  {(20000 - streamedBalance).toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}{" "}
                  <span className="text-xs text-gray-400 font-normal">
                    USDT
                  </span>
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1 h-4 bg-purple-400 rounded-full"></div>
                  <span className="text-xs text-gray-500 uppercase font-medium">
                    Withdrawn
                  </span>
                </div>
                <p className="text-lg font-bold">
                  256.76{" "}
                  <span className="text-xs text-gray-400 font-normal">
                    USDT
                  </span>
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1 h-4 bg-green-400 rounded-full"></div>
                  <span className="text-xs text-gray-500 uppercase font-medium">
                    Withdrawable
                  </span>
                </div>
                <p className="text-xl font-bold text-[#F9140D] tabular-nums">
                  {withdrawable.toLocaleString("en-US", {
                    minimumFractionDigits: 4,
                  })}
                  <span className="text-xs text-gray-400 font-normal ml-1">
                    USDT
                  </span>
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700">Overview</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-xs text-gray-400 uppercase">Chain</p>
                <p className="font-medium text-sm text-gray-700">
                  {EMPLOYEE_STREAM_DATA.chain}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400 uppercase">Rate / Month</p>
                <p className="font-medium text-sm text-gray-700">
                  {EMPLOYEE_STREAM_DATA.ratePerMonth.toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400 uppercase">Status</p>
                <p className="font-medium text-sm text-gray-700">
                  {EMPLOYEE_STREAM_DATA.status}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400 uppercase">Stream ID</p>
                <div className="flex items-center gap-1">
                  <p className="font-medium text-sm truncate max-w-25">
                    {EMPLOYEE_STREAM_DATA.id}
                  </p>
                  <Copy
                    size={12}
                    className="text-gray-400 cursor-pointer hover:text-[#F9140D]"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Wallet Balance Section */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2">
            <Wallet size={18} className="text-[#F9140D]" /> Wallet Balance
          </h3>
          <button className="text-xs text-gray-400 hover:text-[#F9140D]">
            See all
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {WALLET_ASSETS.map((asset, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all cursor-pointer hover:shadow-md
                ${
                  asset.symbol === "PHII"
                    ? "bg-red-50 border-red-100 hover:border-red-200"
                    : "bg-gray-50 border-gray-100 hover:bg-white"
                }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm
                      ${
                        asset.symbol === "PHII"
                          ? "bg-[#F9140D] text-white"
                          : "bg-white text-gray-600"
                      }`}
                  >
                    {asset.symbol === "PHII" ? (
                      <Coins size={18} />
                    ) : (
                      asset.symbol[0]
                    )}
                  </div>
                  <div>
                    <span
                      className={`font-bold block ${
                        asset.symbol === "PHII"
                          ? "text-[#F9140D]"
                          : "text-gray-800"
                      }`}
                    >
                      {asset.symbol}
                    </span>
                    {asset.symbol === "PHII" && (
                      <span className="text-[10px] text-red-400 font-medium">
                        Mancer Token
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-lg ${
                    asset.isUp
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {asset.change}
                </span>
              </div>
              <div className="mt-2">
                <p className="text-xl font-bold text-gray-900">
                  {asset.balance}
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  ≈ {asset.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Transactions */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700 pl-1">
          Recent Transactions
        </h3>
        <div className="space-y-3">
          {TRANSACTIONS.map((tx) => (
            <div
              key={tx.id}
              className="bg-white p-4 rounded-xl flex justify-between items-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    tx.icon === "bank"
                      ? "bg-orange-100 text-orange-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {tx.icon === "bank" ? (
                    <Briefcase size={18} />
                  ) : (
                    <ArrowDownLeft size={18} />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">
                    {tx.entity}
                  </p>
                  <p className="text-xs text-gray-400">
                    {tx.date}, {tx.type}
                  </p>
                </div>
              </div>
              <span
                className={`font-bold text-sm ${
                  tx.amount.startsWith("-") ? "text-gray-800" : "text-green-600"
                }`}
              >
                {tx.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboardPage;
