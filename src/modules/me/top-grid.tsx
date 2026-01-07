"use client";
import Badge from "@/components/shared/Badge";
import Card from "@/components/shared/Card";
import { Briefcase, FileText, Copy } from "lucide-react";
import { CONFIG } from "@/constants/config";

import { useEmployeeStreamDetail } from "@/libs/services/employee";
import { useStreamStore } from "@/libs/stores/stream-store";
import { useWallet } from "@/libs/hooks";
import { formatAddress } from "@/libs/utils";

interface Props {
  streamedBalance: number;
  withdrawable: number;
}

export default function Top_grid({ streamedBalance, withdrawable }: Props) {
  const { activeStreamId } = useStreamStore();
  const streamId = activeStreamId || 0n; // Fallback to 0n if no active stream is selected
  const {
    streamDetail,
    tokenSymbol,
    ratePerMonth,
    streamStatus,
    loading,
    error,
    withdrawableAmount,
    balance,
    balanceFormated,
  } = useEmployeeStreamDetail(streamId);

  const { address: recepientAddress } = useWallet();

  // Hitung persentase progress gauge
  const calculateProgressPercentage = () => {
    if (!streamDetail || !ratePerMonth || ratePerMonth === 0) return 0;

    // Menghitung persentase balance yang sudah digunakan
    const usedPercentage = (Number(streamDetail.balance) / ratePerMonth) * 100;
    return Math.min(usedPercentage, 100); // Maksimal 100%
  };

  // Menghitung stroke dasharray untuk progress gauge
  const progressPercentage = calculateProgressPercentage();
  const circumference = 251; // Keliling lingkaran
  const strokeDasharray = `${
    (progressPercentage / 100) * circumference
  } ${circumference}`;

  // Menghitung debt dan withdrawn berdasarkan data dari hook
  const debt = Number(balance) - Number(withdrawableAmount);
  const withdrawn =
    balance && withdrawableAmount
      ? Number(balance) - Number(withdrawableAmount)
      : 0;

  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F9140D] mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data stream...</p>
          </div>
        </Card>
        <Card className="lg:col-span-2 flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F9140D] mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data accounting...</p>
          </div>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <p className="text-red-600 font-medium">Terjadi kesalahan</p>
            <p className="text-gray-600 text-sm mt-2">
              Gagal memuat data stream
            </p>
          </div>
        </Card>
        <Card className="lg:col-span-2 flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <p className="text-red-600 font-medium">Terjadi kesalahan</p>
            <p className="text-gray-600 text-sm mt-2">
              Gagal memuat data accounting
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Fallback untuk data yang tidak tersedia
  if (!streamDetail || !tokenSymbol) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-gray-400 text-4xl mb-4">📊</div>
            <p className="text-gray-600 font-medium">Data tidak tersedia</p>
            <p className="text-gray-500 text-sm mt-2">
              Silakan pilih stream yang aktif
            </p>
          </div>
        </Card>
        <Card className="lg:col-span-2 flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-gray-400 text-4xl mb-4">📊</div>
            <p className="text-gray-600 font-medium">Data tidak tersedia</p>
            <p className="text-gray-500 text-sm mt-2">
              Silakan pilih stream yang aktif
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Gauge Card */}
      <Card className="lg:col-span-1 relative overflow-hidden flex flex-col justify-between">
        <div className="text-center mt-4 mb-6">
          <div className="relative w-48 h-48 mx-auto">
            <div className="">
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
                  strokeDasharray={strokeDasharray}
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className=" absolute inset-0 flex flex-col items-center justify-center">
              <div
                className={`w-10 h-10 ${
                  tokenSymbol == "PHII" ? "bg-primary" : "bg-teal-500"
                } rounded-full flex items-center justify-center text-white mb-2 shadow-md`}
              >
                <span className="font-bold text-xs">
                  {tokenSymbol ? tokenSymbol.charAt(0) : "T"}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {balance
                  ? Number(balanceFormated).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : "0.00"}
              </h2>
              <span className="text-xs font-semibold text-gray-400 uppercase">
                {tokenSymbol || "TOKEN"}
              </span>
              <p className="text-xs text-gray-500 mt-1 font-bold">
                Salary{" "}
                {ratePerMonth?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                {tokenSymbol || "TOKEN"} / Month
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
                <p className="font-semibold">
                  Stream Gaji {streamDetail.sender.slice(0, 6)}...
                  {streamDetail.sender.slice(-4)}
                </p>
              </div>
            </div>
            <Badge status={streamStatus} />
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
        {/* Accounting */}
        <Card>
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-semibold text-gray-700">Accounting</h3>
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
                {ratePerMonth?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                <span className="text-xs text-gray-400 font-normal">
                  {tokenSymbol}
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
                {debt.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}{" "}
                <span className="text-xs text-gray-400 font-normal">
                  {tokenSymbol}
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
                {withdrawn.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}{" "}
                <span className="text-xs text-gray-400 font-normal">
                  {tokenSymbol}
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
              <p className="text-xl font-bold text-[#F9140D] tabular-nums wrap-break-word">
                {withdrawableAmount
                  ? Number(withdrawableAmount).toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                    })
                  : "0"}
                <span className="text-xs text-gray-400 font-normal ml-1">
                  {tokenSymbol}
                </span>
              </p>
            </div>
          </div>
        </Card>

        {/* Overview */}
        <Card>
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700">Overview</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-xs text-gray-400 uppercase">Chain</p>
              <p className="font-medium text-sm text-gray-700">
                Edu Chain Testnet
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-400 uppercase">Rate / Month</p>
              <p className="font-medium text-sm text-gray-700">
                {ratePerMonth?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}

                {" " + tokenSymbol}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-400 uppercase">Status</p>
              <p className="font-medium text-sm text-gray-700">
                {streamStatus}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-400 uppercase">Stream ID</p>
              <div className="flex items-center gap-1">
                <p className="font-medium text-sm truncate max-w-25">
                  {streamId.toString()}
                </p>
                <Copy
                  size={12}
                  className="text-gray-400 cursor-pointer hover:text-[#F9140D]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-400 uppercase">Sender</p>
              <p className="font-medium text-sm text-gray-700">
                {streamDetail.sender
                  ? formatAddress(streamDetail.sender)
                  : "0x0"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-400 uppercase">Recepient</p>
              <p className="font-medium text-sm text-gray-700">
                {recepientAddress ? formatAddress(recepientAddress) : "0x0"}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
