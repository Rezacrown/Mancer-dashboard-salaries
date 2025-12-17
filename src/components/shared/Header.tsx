"use client";
import { useState } from "react";
import { Bell, LogOut, Menu, Search } from "lucide-react";

import { useGetAuthenticated } from "@/libs/hooks/useGetAuthenticated";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();

  const {
    authenticated: isAuthenticated,
    disconnect,
    chain,
  } = useGetAuthenticated();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <header className="h-16 bg-gray-100 border-b border-gray-200 flex items-center justify-between px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg md:hidden"
        >
          <Menu size={20} />
        </button>
        <div className="relative hidden md:block">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder={"Search..."}
            className="pl-10 pr-4 py-2 bg-white border border-transparent focus:bg-white focus:border-[#F9140D] rounded-lg text-sm w-64 outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-[#F9140D] hover:bg-red-50 rounded-lg transition-colors">
          <Bell size={20} />
        </button>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-xs font-medium text-gray-600">
            {chain?.name}
          </span>
        </div>

        {isAuthenticated && (
          <button
            onClick={() => disconnect()}
            className="ml-2 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
