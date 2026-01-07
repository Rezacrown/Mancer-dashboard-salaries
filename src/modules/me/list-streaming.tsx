"use client";
import {
  Activity,
  Search,
  Filter,
  PauseCircle,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import {
  type EmployeeStream,
  useGetEmployeeStreams,
} from "@/libs/services/employee";
import { useStreamStore } from "@/libs/stores/stream-store";
import { formatAddress } from "@/libs/utils";
import { useState } from "react";

export default function List_streaming() {
  const mockAddress = "0x8Df44cbEae7E9227DE84947d9C350b18A1b5a04b";
  const [limit, setLimit] = useState(5);

  const { activeStreamId, setActiveStreamId } = useStreamStore();

  const { streams, loading } = useGetEmployeeStreams(mockAddress, limit);

  // Function to map stream data to table format
  const mapStreamToTableData = (stream: EmployeeStream, index: number) => {
    const streamId = Number(stream.streamId);
    const senderAddress = stream.sender as string;
    const shortenedAddress = formatAddress(senderAddress);

    // Generate avatar from company name or use default
    const avatarColors = [
      "bg-red-100 text-red-600",
      "bg-blue-100 text-blue-600",
      "bg-purple-100 text-purple-600",
      "bg-gray-100 text-gray-600",
    ];
    const avatarColor = avatarColors[index % avatarColors.length];

    // Get avatar initials from sender address
    const avatar = shortenedAddress.slice(0, 2).toUpperCase();

    // Determine status from contract data
    let status = "Streaming";
    if (stream.isVoided) {
      status = "Completed";
    } else if (stream.isPaused) {
      status = "Paused";
    }

    return {
      id: streamId,
      sender: shortenedAddress,
      rate: stream.ratePerMonth || 0,
      rateFormatted: stream.ratePerMonthFormatted || "0",
      token: stream.tokenSymbol || "TOKEN",
      status,
      avatar,
      avatarColor,
      originalStream: stream,
    };
  };

  // Map streams to table format
  const tableStreams = streams.map((stream, index) => {
    return mapStreamToTableData(stream, index);
  });

  return (
    <div className="mb-8">
      <div className="flex justify-between items-end mb-4 px-1">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Incoming Streams</h2>
          <p className="text-sm text-slate-500">
            Manage all your active income sources
          </p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-gray-400 hover:bg-white hover:shadow-sm rounded-lg border border-transparent hover:border-gray-100 transition">
            <Search size={18} />
          </button>
          <button className="p-2 text-gray-400 hover:bg-white hover:shadow-sm rounded-lg border border-transparent hover:border-gray-100 transition">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-400 font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">Sender / Company</th>
                <th className="px-6 py-4">Flow Rate</th>

                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <p className="text-gray-500">Loading streams...</p>
                  </td>
                </tr>
              ) : tableStreams.length > 0 ? (
                tableStreams.map((stream) => (
                  <tr
                    key={stream.id}
                    className={`group transition-all hover:bg-slate-50 cursor-pointer ${
                      activeStreamId === BigInt(stream.id) ? "bg-red-50/30" : ""
                    }`}
                    onClick={() => setActiveStreamId(BigInt(stream.id))}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${stream.avatarColor}`}
                        >
                          {stream.avatar}
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-mono">
                            {stream.sender}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-700">
                          {stream.rateFormatted} {stream.token}
                        </span>
                        <span className="text-xs text-gray-400">per month</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          stream.status === "Streaming"
                            ? "bg-green-50 text-green-700 border-green-100"
                            : stream.status === "Paused"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-100"
                            : "bg-gray-50 text-gray-600 border-gray-100"
                        }`}
                      >
                        {stream.status === "Streaming" && (
                          <Activity size={12} className="animate-pulse" />
                        )}
                        {stream.status === "Paused" && (
                          <PauseCircle size={12} />
                        )}
                        {stream.status === "Completed" && (
                          <CheckCircle2 size={12} />
                        )}
                        {stream.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {activeStreamId === BigInt(stream.id) ? (
                        <span className="text-xs font-bold text-red-500 uppercase tracking-wide">
                          Viewing
                        </span>
                      ) : (
                        <button className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-white rounded-full">
                          <ChevronRight size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <p className="text-gray-500">No streams found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50/50 px-6 py-3 border-t border-gray-100 text-center">
          <button
            onClick={() => setLimit((limit) => limit + 5)}
            className="text-sm text-slate-500 font-medium hover:text-red-600 transition"
          >
            View All History
          </button>
        </div>
      </div>
    </div>
  );
}
