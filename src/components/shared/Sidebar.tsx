"use client";

import { useEffect, useState } from "react";
import SidebarItem from "./SidebarItem";

import {
  Briefcase,
  Copy,
  CopyCheck,
  FileText,
  Home,
  Menu,
  PlusCircle,
  RefreshCw,
  Settings,
  Users,
  Wallet,
  X,
} from "lucide-react";

import { usePathname, useRouter } from "next/navigation";
import { formatAddress } from "@/libs/utils";

import { USER_PROFILE } from "@/constants/Mock";

import { useWallet } from "@/libs/hooks/useWallet";
import { useMenuStore } from "@/libs/stores/menu-store";
import { useWindowWidth } from "@/libs/hooks/useWindowWidth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Address } from "viem";

const Sidebar = () => {
  const { address } = useWallet();
  const router = useRouter();
  const pathname = usePathname();
  const width = useWindowWidth();

  const { sidebarIsOpen, setSidebarOpen } = useMenuStore();

  const [copied, setCopied] = useState(false);

  // here
  const isEmployer = false;

  const getActiveMenu = (path: string): boolean => {
    return pathname == path;
  };

  const handleCopyAddress = async (addr: Address) => {
    try {
      await window.navigator.clipboard.writeText(addr);
      setCopied(true);
    } finally {
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const isOpen = sidebarIsOpen || (width && width > 768);

  return (
    <>
      <aside
        className={`${
          isOpen ? "w-64 fixed lg:static z-30" : "w-0"
        } shrink-0 bg-white border-r border-gray-200 flex-col transition-all duration-300 h-full md:flex`}
      >
        {/* header sidebar */}
        <div className="p-6 flex justify-between lg:items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="w-8 h-8 rounded-full bg-[#F9140D] flex items-center justify-center text-white font-bold text-lg cursor-pointer"
          >
            M
          </button>
          {sidebarIsOpen && (
            <button
              onClick={() => setSidebarOpen(!sidebarIsOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg md:hidden"
            >
              <Menu size={20} />
            </button>
          )}
        </div>

        {/* User Profile Snippet */}
        <div
          className={`mx-4 mb-6 p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3 ${
            !isOpen && "justify-center"
          }`}
        >
          <img
            src={USER_PROFILE?.avatar}
            alt="User"
            className="w-10 h-10 rounded-full bg-gray-200"
          />
          {isOpen && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{USER_PROFILE?.name}</p>
              <p className="text-xs flex text-gray-500 uppercase font-semibold mt-0.5">
                {address && formatAddress(address)}
                {copied ? (
                  <CopyCheck className="size-4 mx-2 text-primary" />
                ) : (
                  <Copy
                    onClick={() => handleCopyAddress(address!)}
                    className="size-4 mx-2 cursor-pointer hover:text-primary transition-all"
                  />
                )}
              </p>
            </div>
          )}
        </div>

        {/* navigation item */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {isEmployer ? (
            <EmployerMenu getActiveMenu={getActiveMenu} router={router} />
          ) : (
            <EmployeeMenu getActiveMenu={getActiveMenu} router={router} />
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

function EmployerMenu({
  getActiveMenu,
  router,
}: {
  getActiveMenu: (path: string) => boolean;
  router: AppRouterInstance;
}) {
  return (
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
  );
}

function EmployeeMenu({
  getActiveMenu,
  router,
}: {
  getActiveMenu: (path: string) => boolean;
  router: AppRouterInstance;
}) {
  return (
    <>
      <SidebarItem icon={Briefcase} label="Quest" />
      <SidebarItem icon={Home} label="Overview" />
      <SidebarItem
        active={getActiveMenu("/me")}
        icon={Wallet}
        label="Salary Balance"
      />
      <SidebarItem icon={FileText} label="Course" />
    </>
  );
}
