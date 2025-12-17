"use client";
import Badge from "@/components/shared/Badge";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Clock,
  Copy,
  RefreshCw,
  Settings,
  Wallet,
  Activity,
  PlusCircle,
  PauseCircle,
  PlayCircle,
  Edit3,
  Download,
  Trash2,
} from "lucide-react";

import { INITIAL_STREAMS } from "@/constants/Mock";
import Card from "@/components/shared/Card";

const EmployerStreamDetail = () => {
  const stream = INITIAL_STREAMS[0];
  //   if (!stream) return null;

  // Mock Calculations
  const ratePerSec = stream.ratePerMonth / (30 * 24 * 3600);
  const elapsedSeconds = (Date.now() - stream.startTime) / 1000;
  const totalAccrued = ratePerSec * elapsedSeconds;

  // Simulated dynamic values
  const withdrawable =
    stream.status === "Voided"
      ? 0
      : Math.min(totalAccrued * 0.4, stream.balance);
  const refundable =
    stream.status === "Voided" ? 0 : Math.max(0, stream.balance - withdrawable);
  const depletionDate = new Date(
    Date.now() + (stream.balance / ratePerSec) * 1000
  );
  const protocolFee = withdrawable * 0.001;

  const handleAction = (action: string) => {
    alert(`Simulated Action: ${action} for stream ${stream.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Header Navigation */}
      <div className="flex items-center gap-4 mb-6">
        <button
          //   onClick={onBack}
          className="p-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors shadow-sm"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            Stream Details
            <Badge status={stream.status as "Active" | "Paused" | "Voided"} />
          </h1>
          <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
            ID: {stream.id}{" "}
            <Copy size={12} className="cursor-pointer hover:text-[#F9140D]" />
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Main Stats & Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-linear-to-br from-[#F9140D] to-red-600 text-white border-none">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-red-100 text-xs font-semibold uppercase">
                    Withdrawable (Employee)
                  </p>
                  <p className="text-3xl font-bold mt-2">
                    {withdrawable.toLocaleString(undefined, {
                      maximumFractionDigits: 4,
                    })}
                  </p>
                  <p className="text-sm text-red-100 mt-1">{stream.token}</p>
                </div>
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Wallet size={24} className="text-white" />
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/20 flex items-center gap-2 text-xs text-red-100">
                <AlertTriangle size={12} />
                Est. Protocol Fee: {protocolFee.toFixed(5)} {stream.token}
              </div>
            </Card>

            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-xs font-semibold uppercase">
                    Refundable (You)
                  </p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {refundable.toLocaleString(undefined, {
                      maximumFractionDigits: 4,
                    })}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{stream.token}</p>
                </div>
                <div className="p-2 bg-gray-100 rounded-lg">
                  <RefreshCw size={24} className="text-gray-600" />
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500">
                Available to pull back immediately
              </div>
            </Card>
          </div>

          {/* Configuration Detail */}
          <Card>
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Settings size={18} className="text-gray-400" /> Configuration
            </h3>
            <div className="grid grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">
                  Recipient
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                    {stream.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {stream.name}
                    </p>
                    <p className="text-xs text-gray-400 font-mono">
                      {stream.recipient}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">
                  Flow Rate
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {stream.ratePerMonth.toLocaleString()}{" "}
                  <span className="text-sm text-gray-500 font-normal">/mo</span>
                </p>
                <p className="text-xs text-gray-400">
                  ≈ {(stream.ratePerMonth / 30 / 24 / 3600).toFixed(6)} / sec
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">
                  Start Time
                </p>
                <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Calendar size={14} className="text-gray-400" />
                  {new Date(stream.startTime).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">
                  Depletion Date
                </p>
                <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Clock size={14} className="text-orange-500" />
                  {stream.balance > 0
                    ? depletionDate.toLocaleDateString()
                    : "Depleted"}
                </p>
              </div>
            </div>
          </Card>

          {/* Action Panel */}
          <Card>
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Activity size={18} className="text-gray-400" /> Management
            </h3>

            {/* Primary Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <button
                onClick={() => handleAction("Deposit")}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PlusCircle size={20} />
                </div>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-green-700">
                  Deposit
                </span>
              </button>

              {stream.status === "Active" ? (
                <button
                  onClick={() => handleAction("Pause")}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-yellow-500 hover:bg-yellow-50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PauseCircle size={20} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-yellow-700">
                    Pause
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => handleAction("Restart")}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PlayCircle size={20} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700">
                    Restart
                  </span>
                </button>
              )}

              <button
                onClick={() => handleAction("Adjust Rate")}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Edit3 size={20} />
                </div>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700">
                  Adjust Rate
                </span>
              </button>

              <button
                onClick={() => handleAction("Refund")}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Download size={20} />
                </div>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-orange-700">
                  Refund
                </span>
              </button>
            </div>

            {/* Danger Zone */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase mb-3">
                Danger Zone
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleAction("Refund Max")}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 flex items-center gap-2 transition-colors"
                >
                  <Download size={16} /> Refund Max
                </button>
                <button
                  onClick={() => handleAction("Void")}
                  className="px-4 py-2 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 flex items-center gap-2 transition-colors"
                >
                  <Trash2 size={16} /> Void Stream Permanently
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Timeline */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Clock size={18} className="text-gray-400" /> Event History
            </h3>
            <div className="relative border-l-2 border-gray-100 pl-6 space-y-8">
              {stream.events &&
                stream.events.map((event, idx) => (
                  <div key={idx} className="relative">
                    {/* Timeline Node */}
                    <div
                      className={`absolute -left-7.75 top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center
                     ${
                       event.type === "Create"
                         ? "bg-blue-500"
                         : event.type === "Deposit"
                         ? "bg-green-500"
                         : event.type === "Withdraw"
                         ? "bg-orange-500"
                         : "bg-gray-400"
                     }`}
                    ></div>

                    <p className="text-xs text-gray-400 mb-1">{event.date}</p>
                    <p className="text-sm font-bold text-gray-800">
                      {event.type}
                    </p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {event.desc}
                    </p>
                  </div>
                ))}

              {/* End of timeline indicator */}
              <div className="relative">
                <div className="absolute -left-7.25 top-1 w-3 h-3 rounded-full bg-gray-200"></div>
                <p className="text-xs text-gray-400 italic">Start of history</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployerStreamDetail;
