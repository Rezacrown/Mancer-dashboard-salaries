"use client";
import React from "react";
import { ArrowDownLeft, Briefcase } from "lucide-react";
import { useGetRecentTransactions } from "@/libs/services/employee";
import { formatAddress } from "@/libs/utils";
import { useWallet } from "@/libs/hooks/useWallet";

export default function TransactionSection() {
  const { address } = useWallet();

  const { transactions } = useGetRecentTransactions(address!);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-700 pl-1">Recent Transactions</h3>
      <div className="space-y-3">
        {transactions.length > 0 ? (
          transactions.map((tx, idx) => (
            <div
              key={`transaction-history-${idx}`}
              className="bg-white p-4 rounded-xl flex justify-between items-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    tx.type == "Withdraw"
                      ? "bg-orange-100 text-orange-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {tx.type === "Withdraw" ? (
                    <Briefcase size={18} />
                  ) : (
                    <ArrowDownLeft size={18} />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">
                    {/* {tx.entity} */}

                    {tx.type == "Stream Started"
                      ? formatAddress(tx.hash)
                      : "BANK JAGO"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {" "}
                    {tx.type == "Stream Started" ? "Received" : "Withdraw"}
                  </p>
                </div>
              </div>
              <span
                className={`font-bold text-sm ${
                  tx.amount!.startsWith("-")
                    ? "text-gray-800"
                    : "text-green-600"
                }`}
              >
                {tx.amount} ETH
              </span>
            </div>
          ))
        ) : (
          <>
            <h3 className="text-center text-gray-700 font-medium text-base py-16">
              Not have already transaction yet
            </h3>
          </>
        )}

        {/* {TRANSACTIONS.map((tx) => (
          <div
            key={tx.id}
            className="bg-white p-4 rounded-xl flex justify-between items-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  tx.icon === "bank"
                    ? "bg-orange-100 text-orange-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {tx.icon === "bank" ? (
                  <Briefcase size={18} />
                ) : (
                  <ArrowDownLeft size={18} />
                )}
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-800">
                  {tx.entity}
                </p>
                <p className="text-xs text-gray-400">
                  {tx.date}, {tx.type}
                </p>
              </div>
            </div>
            <span
              className={`font-bold text-sm ${
                tx.amount.startsWith("-") ? "text-gray-800" : "text-green-600"
              }`}
            >
              {tx.amount}
            </span>
          </div>
        ))} */}
      </div>
    </div>
  );
}
