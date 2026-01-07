"use client";
import { useState, useEffect } from "react";
import Badge from "@/components/shared/Badge";
import Card from "@/components/shared/Card";
import { Briefcase, FileText, X } from "lucide-react";

import { StreamDetail, useWithdrawSalary } from "@/libs/services/employee";
import { useWallet } from "@/libs/hooks";
import { parseUnits } from "viem";

interface GaugeCardProps {
  balance: bigint;
  balanceFormated: string;
  withdrawableAmount: bigint;
  withdrawableAmountFormated: string;
  tokenSymbol: string;
  ratePerMonth: number;
  progressPercentage: number;
  strokeDasharray: string;
  streamDetail: StreamDetail;
  streamId: bigint;
  streamStatus: "Active" | "Paused" | "Voided";
  onWithdraw?: () => void;
  onViewContract?: () => void;
}

export default function GaugeCard({
  balance,
  balanceFormated,
  tokenSymbol,
  ratePerMonth,
  progressPercentage,
  strokeDasharray,
  streamDetail,
  streamStatus,
  onWithdraw,
  onViewContract,
  streamId,
  withdrawableAmount,
  withdrawableAmountFormated,
}: GaugeCardProps) {
  const [showWithdrawPopup, setShowWithdrawPopup] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawPercentage, setWithdrawPercentage] = useState(0);

  const { address } = useWallet();

  const { withdraw, withdrawMax, isWithdrawing, isSuccess, error, reset } =
    useWithdrawSalary(streamId, address);

  // === Modal UI Function
  const handleWithdrawClick = () => {
    setShowWithdrawPopup(true);
    // Reset state saat popup dibuka
    setWithdrawAmount("");
    setWithdrawPercentage(0);
  };

  const handleClosePopup = () => {
    setShowWithdrawPopup(false);
    // Reset error state saat popup ditutup
    if (error) {
      reset();
    }
  };

  // === Handle function for Withdraw actions
  const handlePercentageClick = (percentage: number) => {
    setWithdrawPercentage(percentage);
    // Hitung jumlah berdasarkan persentase dari withdrawable amount
    const amount = (Number(withdrawableAmountFormated) * percentage) / 100;
    setWithdrawAmount(amount.toString());
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Validasi input agar tidak melebihi withdrawable amount yang tersedia
    if (value && withdrawableAmountFormated) {
      const numericValue = Number(value);
      const maxBalance = Number(withdrawableAmountFormated);

      // Jika nilai melebihi withdrawable amount, set ke nilai maksimum
      if (numericValue > maxBalance) {
        setWithdrawAmount(withdrawableAmountFormated);
        setWithdrawPercentage(100);
      } else {
        setWithdrawAmount(value);
        // Update persentase berdasarkan jumlah yang dimasukkan
        const percentage = (numericValue / maxBalance) * 100;
        setWithdrawPercentage(Math.min(percentage, 100)); // Maksimal 100%
      }
    } else if (value === "") {
      setWithdrawAmount("");
      setWithdrawPercentage(0);
    }
  };

  const handleMaxClick = () => {
    setWithdrawPercentage(100);
    setWithdrawAmount(withdrawableAmountFormated || "0");
  };

  const handleConfirmWithdraw = async () => {
    try {
      // Konversi amount dari string ke bigint
      const amountInBigInt = parseUnits(
        withdrawAmount,
        streamDetail.tokenDecimals
      );

      if (
        withdrawPercentage == 100 &&
        Number(withdrawAmount) == Number(withdrawableAmountFormated)
      ) {
        // withdraw max
        await withdrawMax();
      } else if (
        withdrawPercentage < 100 &&
        Number(withdrawAmount) < Number(withdrawableAmountFormated)
      ) {
        // custom withdraw
        await withdraw(amountInBigInt);
      }

      // Jangan langsung tutup popup, tunggu sampai transaksi berhasil
      // State akan dihandle oleh useEffect atau callback dari hook
    } catch (err) {
      console.error("Error during withdraw:", err);
      // Error akan ditampilkan melalui state error dari hook
    }
  };

  // Efek untuk menutup popup saat withdraw berhasil
  useEffect(() => {
    if (isSuccess) {
      setShowWithdrawPopup(false);
      setWithdrawAmount("");
      setWithdrawPercentage(0);
      reset(); // Reset state hook
    }
  }, [isSuccess, reset]);

  return (
    <Card className="lg:col-span-1 relative overflow-hidden flex flex-col justify-between">
      {/*  */}
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
              {withdrawableAmountFormated
                ? Number(withdrawableAmountFormated).toLocaleString("en-US", {
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

      {/*  */}
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

        <button
          onClick={handleWithdrawClick}
          className="w-full py-3 bg-[#F9140D] hover:bg-red-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-200 active:scale-95"
        >
          Withdraw
        </button>
        <button
          onClick={onViewContract}
          className="w-full py-3 bg-white border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
        >
          <FileText size={16} /> View the contract
        </button>
      </div>

      {/* Withdraw Popup Modal */}
      {showWithdrawPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 z-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Withdraw Funds
              </h3>
              <button
                onClick={handleClosePopup}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount ({tokenSymbol})
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={handleAmountChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F9140D] focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  max={withdrawableAmountFormated}
                  disabled={isWithdrawing}
                />
                <button
                  onClick={handleMaxClick}
                  className="absolute right-2 top-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200"
                  disabled={isWithdrawing}
                >
                  MAX
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Available: {withdrawableAmountFormated} {tokenSymbol}
              </div>

              {/* Tampilkan error message jika ada */}
              {error && (
                <div className="text-xs text-red-500 mt-1">{error}</div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Percentage
              </label>
              <div className="flex gap-2 mb-3">
                {[25, 50, 75].map((percentage) => (
                  <button
                    key={percentage}
                    onClick={() => handlePercentageClick(percentage)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      withdrawPercentage === percentage
                        ? "bg-[#F9140D] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {percentage}%
                  </button>
                ))}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-[#F9140D] h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${withdrawPercentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1 text-center">
                {withdrawPercentage.toFixed(0)}%
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleClosePopup}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmWithdraw}
                disabled={
                  !withdrawAmount ||
                  Number(withdrawAmount) <= 0 ||
                  isWithdrawing
                }
                className={`flex-1 py-3 font-medium rounded-lg transition-colors ${
                  !withdrawAmount ||
                  Number(withdrawAmount) <= 0 ||
                  isWithdrawing
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#F9140D] text-white hover:bg-red-700"
                }`}
              >
                {isWithdrawing ? "Processing..." : "Confirm Withdraw"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
