"use client";
import Card from "@/components/shared/Card";

import { useEmployeeStreamDetail } from "@/libs/services/employee";
import { useStreamStore } from "@/libs/stores/stream-store";
import { useWallet } from "@/libs/hooks";
import { formatAddress } from "@/libs/utils";

// Import new components
import GaugeCard from "./gauge-card";
import AccountingCard from "./accounting-card";
import OverviewCard from "./overview-card";

export default function Top_grid() {
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
    withdrawableAmountFormated,
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
      <GaugeCard
        streamId={streamId!}
        streamDetail={streamDetail}
        balance={balance || 0n}
        balanceFormated={balanceFormated || "0"}
        withdrawableAmount={withdrawableAmount}
        withdrawableAmountFormated={withdrawableAmountFormated}
        tokenSymbol={tokenSymbol}
        ratePerMonth={ratePerMonth}
        progressPercentage={progressPercentage}
        strokeDasharray={strokeDasharray}
        streamStatus={streamStatus}
      />

      {/* Accounting & Overview */}
      <div className="lg:col-span-2 grid grid-cols-1 gap-6">
        {/* Accounting */}
        <AccountingCard
          ratePerMonth={ratePerMonth}
          debt={debt}
          withdrawn={withdrawn}
          withdrawableAmountFormated={withdrawableAmountFormated || "0"}
          tokenSymbol={tokenSymbol}
        />

        {/* Overview */}
        <OverviewCard
          streamId={streamId}
          ratePerMonth={ratePerMonth}
          tokenSymbol={tokenSymbol}
          streamStatus={streamStatus}
          streamDetail={streamDetail}
          recepientAddress={recepientAddress || "0x0"}
        />
      </div>
    </div>
  );
}
