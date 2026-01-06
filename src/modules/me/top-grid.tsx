"use client";
import Badge from "@/components/shared/Badge";
import Card from "@/components/shared/Card";
import { Briefcase, FileText, Copy } from "lucide-react";

import { EMPLOYEE_STREAM_DATA } from "@/constants/Mock";
import { useEmployeeStreamDetail } from "@/libs/services/employee";
import { useStreamStore } from "@/libs/stores/stream-store";

interface Props {
  streamedBalance: number;
  withdrawable: number;
}

export default function Top_grid({ streamedBalance, withdrawable }: Props) {
  const { activeStreamId } = useStreamStore();
  const streamId = activeStreamId || 0n; // Fallback to 1n if no active stream is selected
  const { status, streamDetail } = useEmployeeStreamDetail(streamId);

  console.log(streamDetail);

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
                  strokeDasharray="180 251"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className=" absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white mb-2 shadow-md">
                <span className="font-bold text-xs">T</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {streamDetail?.balance.toLocaleString("en-US", {
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
            <Badge status={Boolean(status) ? "Active" : "Voided"} />
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
                <span className="text-xs text-gray-400 font-normal">USDT</span>
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
                <span className="text-xs text-gray-400 font-normal">USDT</span>
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
                <span className="text-xs text-gray-400 font-normal">USDT</span>
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

            <div className="space-y-1">
              <p className="text-xs text-gray-400 uppercase">Sender</p>
              <p className="font-medium text-sm text-gray-700">
                {EMPLOYEE_STREAM_DATA.sender}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-400 uppercase">Recepient</p>
              <p className="font-medium text-sm text-gray-700">
                {EMPLOYEE_STREAM_DATA.recipient}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
