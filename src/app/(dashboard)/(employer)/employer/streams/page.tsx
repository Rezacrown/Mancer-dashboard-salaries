"use client";
import Card from "@/components/shared/Card";
import { PlusCircle, FileText, RefreshCw, AlertCircle } from "lucide-react";

import Badge from "@/components/shared/Badge";
import { useRouter } from "next/navigation";
import { Address } from "viem";
import {
  EmployerStream,
  useGetEmployerStreams,
} from "@/libs/services/employer";
import { useCalculateMonthlyRate } from "@/libs/hooks/useCalculateMonthlyRate";
import { useWallet } from "@/libs/hooks/useWallet";

const EmployerStreamList = () => {
  const router = useRouter();
  const { address } = useWallet();

  const mockAddr = true
    ? address
    : ("0x62B969EB63bE8E9c9622ca1E096675360F14859A" as Address);

  const { calculateMonthlyRate } = useCalculateMonthlyRate();

  const {
    streams: blockchainStreams,
    loading,
    error,
    refetch,
  } = useGetEmployerStreams(mockAddr);

  // Transformasi data dari format blockchain ke format UI
  const transformStreamData = (blockchainStream: EmployerStream) => {
    const monthlyRate = calculateMonthlyRate(
      blockchainStream.ratePerSecond,
      18
    );

    return {
      id: `${blockchainStream.streamId.toString()}`,
      recipient: blockchainStream.recipient,
      name: `Employee ${blockchainStream.recipient.slice(0, 6)}...`, // Placeholder name
      token: "PHII", // Placeholder token
      ratePerMonth: parseFloat(monthlyRate),
      balance: blockchainStream.balanceFormated
        ? parseFloat(blockchainStream.balanceFormated)
        : 0, // Use real balance from hook
      status: "Active", // Placeholder status
      ratePerSecond: blockchainStream.ratePerSecondFormated,
    };
  };

  const streams = blockchainStreams.map(transformStreamData);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Employer Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage all outgoing salary streams
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-all active:scale-95"
            title="Refresh streams"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => router.push("/employer/stream/create")}
            className="flex items-center gap-2 bg-[#F9140D] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-95"
          >
            <PlusCircle size={18} />
            Create Stream
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="flex items-center gap-4 p-4 bg-red-50 border border-red-200">
          <AlertCircle size={20} className="text-red-500" />
          <div className="flex-1">
            <p className="text-red-700 font-medium">Error loading data</p>
            <p className="text-red-500 text-sm">{error}</p>
          </div>
          <button
            onClick={() => {
              refetch();
            }}
            className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-200 transition-all"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </Card>
      )}

      {/* Summary Stats */}

      {/* Streams Table */}
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Stream ID
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Rate / Sec
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                // Loading state
                Array.from({ length: 3 }).map((_, index) => (
                  <tr key={index}>
                    {Array.from({ length: 6 }).map((_, cellIndex) => (
                      <td key={cellIndex} className="px-6 py-4">
                        <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : streams.length === 0 ? (
                // Empty state
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <FileText size={48} className="text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No streams found
                      </h3>
                      <p className="text-gray-500 mb-4 max-w-md">
                        You haven't created any salary streams yet. Start by
                        creating your first stream.
                      </p>
                      <button
                        onClick={() => router.push("/employer/stream/create")}
                        className="flex items-center gap-2 bg-[#F9140D] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-95"
                      >
                        <PlusCircle size={18} />
                        Create Stream
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                // Data loaded successfully
                streams.map((stream) => (
                  <tr
                    key={stream.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td
                      onClick={() => {
                        const streamId = stream.id.split("-")[1]; // Extract numeric ID from FL-123 format
                        router.push(`/employer/stream/${streamId}`);
                      }}
                      className="px-6 py-4 text-sm font-medium text-gray-900 cursor-pointer hover:text-primary transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-gray-400" />
                        {stream.id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                          {stream.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {stream.name}
                          </p>
                          <p className="text-xs text-gray-400 font-mono truncate w-24">
                            {stream.recipient}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {stream.ratePerSecond}{" "}
                      <span className="text-xs text-gray-400">
                        {stream.token}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {stream.balance.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}{" "}
                      <span className="text-xs text-gray-400">
                        {stream.token}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        status={stream.status as "Active" | "Paused" | "Voided"}
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          const streamId = stream.id.split("-")[1]; // Extract numeric ID from FL-123 format
                          router.push(`/employer/stream/${streamId}`);
                        }}
                        className="flex items-center gap-2 bg-[#F9140D] text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-all text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default EmployerStreamList;
