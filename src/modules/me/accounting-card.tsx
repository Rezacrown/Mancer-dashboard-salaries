"use client";
import Card from "@/components/shared/Card";

interface AccountingProps {
  ratePerMonth: number;
  debt: number;
  withdrawn: number;
  withdrawnFormated: string;
  withdrawableAmountFormated: string;
  tokenSymbol: string;
}

export default function AccountingCard({
  ratePerMonth,
  debt,
  withdrawn,
  withdrawnFormated,
  withdrawableAmountFormated,
  tokenSymbol,
}: AccountingProps) {
  return (
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
              minimumFractionDigits: 2,
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
            {Number(withdrawnFormated).toLocaleString("en-US", {
              minimumFractionDigits: 2,
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
            {Number(withdrawableAmountFormated)
              ? Number(withdrawableAmountFormated).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })
              : "0"}
            <span className="text-xs text-gray-400 font-normal ml-1">
              {tokenSymbol}
            </span>
          </p>
        </div>
      </div>
    </Card>
  );
}
