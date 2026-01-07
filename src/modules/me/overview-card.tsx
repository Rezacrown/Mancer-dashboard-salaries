import Card from "@/components/shared/Card";
import { Copy } from "lucide-react";
import { formatAddress } from "@/libs/utils";

interface OverviewProps {
  streamId: bigint;
  ratePerMonth: number;
  tokenSymbol: string;
  streamStatus: string;
  streamDetail: {
    sender: string;
  };
  recepientAddress: string;
}

export default function OverviewCard({
  streamId,
  ratePerMonth,
  tokenSymbol,
  streamStatus,
  streamDetail,
  recepientAddress,
}: OverviewProps) {
  return (
    <Card>
      <div className="mb-4">
        <h3 className="font-semibold text-gray-700">Overview</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="space-y-1">
          <p className="text-xs text-gray-400 uppercase">Chain</p>
          <p className="font-medium text-sm text-gray-700">Edu Chain Testnet</p>
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
          <p className="font-medium text-sm text-gray-700">{streamStatus}</p>
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
            {streamDetail.sender ? formatAddress(streamDetail.sender) : "0x0"}
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
  );
}
