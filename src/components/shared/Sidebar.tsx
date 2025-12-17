"use client";

import { useState } from "react";
import SidebarItem from "./SidebarItem";

import {
  Briefcase,
  FileText,
  Home,
  PlusCircle,
  RefreshCw,
  Settings,
  Users,
  Wallet,
} from "lucide-react";

import { usePathname, useRouter } from "next/navigation";
import { USER_PROFILE } from "@/constants/Mock";
import { useGetAuthenticated } from "@/libs/hooks/useGetAuthenticated";
import { formatAddress } from "@/libs/utils";

const Sidebar = () => {
  const { address } = useGetAuthenticated();
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [isEmployer] = useState(true);

  const getActiveMenu = (path: string): boolean => {
    return pathname == path;
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <>
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } shrink-0 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 h-full md:flex`}
      >
        {/* header sidebar */}
        <div className="p-6 flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="w-8 h-8 rounded-full bg-[#F9140D] flex items-center justify-center text-white font-bold text-lg cursor-pointer"
          >
            M
          </button>
          {sidebarOpen && (
            <span
              onClick={() => router.push("/")}
              className="text-xl font-bold text-[#F9140D] cursor-pointer"
            >
              {}
            </span>
          )}
        </div>

        {/* User Profile Snippet */}
        <div
          className={`mx-4 mb-6 p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3 ${
            !sidebarOpen && "justify-center"
          }`}
        >
          <img
            src={USER_PROFILE.avatar}
            alt="User"
            className="w-10 h-10 rounded-full bg-gray-200"
          />
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{USER_PROFILE.name}</p>
              <p className="text-xs text-gray-500 uppercase font-semibold mt-0.5">
                {address && formatAddress(address)}
              </p>
            </div>
          )}
        </div>

        {/* navigation item */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {isEmployer ? (
            <>
              <SidebarItem
                icon={Home}
                label="Dashboard"
                active={getActiveMenu("/employer/streams")}
                onClick={() => router.push("/employer/streams")}
              />
              <SidebarItem
                icon={PlusCircle}
                label="Create Stream"
                active={getActiveMenu("/employer/create")}
                onClick={() => router.push("/employer/create")}
              />
              <SidebarItem icon={Users} label="Employees" />
              <SidebarItem icon={Settings} label="Settings" />
            </>
          ) : (
            <>
              <SidebarItem icon={Briefcase} label="Quest" />
              <SidebarItem icon={Home} label="Overview" />
              <SidebarItem
                active={pathname == "/me"}
                icon={Wallet}
                label="Salary Balance"
              />
              <SidebarItem icon={FileText} label="Course" />
            </>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
