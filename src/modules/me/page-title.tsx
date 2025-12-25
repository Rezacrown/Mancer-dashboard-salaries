"use client";
import { useWallet } from "@/libs/hooks/useWallet";
import { formatAddress } from "@/libs/utils";
import { ChevronDown } from "lucide-react";

export default function PageT_title() {
  const { address, openAccountModal } = useWallet();

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">My Salary Dashboard</h1>
      <button
        onClick={openAccountModal}
        className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 hover:border-primary hover:text-primary transition-all"
      >
        <span>{address && formatAddress(address)}</span>
        <ChevronDown className="hover:text-primary transition-all" size={16} />
      </button>
    </div>
  );
}
