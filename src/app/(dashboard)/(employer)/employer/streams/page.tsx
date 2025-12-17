"use client";
import Card from "@/components/shared/Card";
import {
  PlusCircle,
  Users,
  DollarSign,
  Wallet,
  FileText,
  PauseCircle,
  PlayCircle,
  Settings,
} from "lucide-react";

import { INITIAL_STREAMS } from "@/constants/Mock";
import Badge from "@/components/shared/Badge";
import { useRouter } from "next/navigation";

const EmployerStreamList = () => {
  const streams = INITIAL_STREAMS;

  const router = useRouter();

  const onCreateClick = () => {};

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Employer Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage all outgoing salary streams
          </p>
        </div>
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 bg-[#F9140D] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-95"
        >
          <PlusCircle size={18} />
          Create Stream
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-[#F9140D]">
            <Users size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase font-semibold">
              Active Employees
            </p>
            <p className="text-2xl font-bold text-gray-800">
              {streams.filter((s) => s.status === "Active").length}
            </p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase font-semibold">
              Total Monthly Flow
            </p>
            <p className="text-2xl font-bold text-gray-800">
              $
              {streams
                .filter((s) => s.status === "Active")
                .reduce((acc, curr) => acc + curr.ratePerMonth, 0)
                .toLocaleString()}
            </p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase font-semibold">
              Total Deposited
            </p>
            <p className="text-2xl font-bold text-gray-800">
              $
              {streams
                .reduce((acc, curr) => acc + curr.balance, 0)
                .toLocaleString()}
            </p>
          </div>
        </Card>
      </div>

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
                  Rate / Month
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
              {streams.map((stream) => (
                <tr
                  key={stream.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td
                    onClick={() => router.push("/employer/stream/1")}
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
                    {stream.ratePerMonth.toLocaleString()}{" "}
                    <span className="text-xs text-gray-400">
                      {stream.token}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {stream.balance.toLocaleString()}{" "}
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
                    <div className="flex items-center justify-end gap-2">
                      {stream.status === "Active" && (
                        <button
                          className="p-1.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg"
                          title="Pause"
                        >
                          <PauseCircle size={18} />
                        </button>
                      )}
                      {stream.status === "Paused" && (
                        <button
                          className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                          title="Resume"
                        >
                          <PlayCircle size={18} />
                        </button>
                      )}
                      <button
                        className="p-1.5 text-gray-400 hover:text-[#F9140D] hover:bg-red-50 rounded-lg"
                        title="Manage"
                      >
                        <Settings size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default EmployerStreamList;
