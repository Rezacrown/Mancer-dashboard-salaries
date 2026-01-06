"use client";
import Card from "@/components/shared/Card";
import { useWallet } from "@/libs/hooks/useWallet";

import { Coins, Wallet } from "lucide-react";

import { useGetEmployeeWalletBalance } from "@/libs/services/employee";

export default function Wallet_balance() {
  const { address } = useWallet();
  const { assets, loading, refetch } = useGetEmployeeWalletBalance(address!);

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
          <Wallet size={18} className="text-[#F9140D]" /> Wallet Balance
        </h3>
        <button className="text-xs text-gray-400 hover:text-[#F9140D]">
          See all
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {assets.length > 0 &&
          assets.map((asset, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all cursor-pointer hover:shadow-md
                ${
                  asset.symbol === "PHII"
                    ? "bg-red-50 border-red-100 hover:border-red-200"
                    : "bg-gray-50 border-gray-100 hover:bg-white"
                }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm
                      ${
                        asset.symbol === "PHII"
                          ? "bg-[#F9140D] text-white"
                          : "bg-white text-gray-600"
                      }`}
                  >
                    {asset.symbol === "PHII" ? (
                      <Coins size={18} />
                    ) : (
                      asset.symbol[0]
                    )}
                  </div>
                  <div>
                    <span
                      className={`font-bold block ${
                        asset.symbol === "PHII"
                          ? "text-[#F9140D]"
                          : "text-gray-800"
                      }`}
                    >
                      {asset.symbol}
                    </span>
                    {asset.symbol === "PHII" && (
                      <span className="text-[10px] text-red-400 font-medium">
                        Mancer Token
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <p
                  className={`text-xl font-bold ${
                    asset.symbol == "PHII" ? "text-primary" : "text-gray-900"
                  }`}
                >
                  {asset.balance}{" "}
                  <span className={`"text-[10px] font-medium"`}>
                    {asset.symbol}
                  </span>
                </p>
              </div>
            </div>
          ))}
      </div>
    </Card>
  );
}
