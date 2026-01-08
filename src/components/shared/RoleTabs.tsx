"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useMenuStore } from "@/libs/stores/menu-store";

/**
 * RoleTabs Component
 *
 * Komponen ini bertanggung jawab untuk:
 * 1. Menampilkan tabs Employee/Employer
 * 2. Menangani navigasi antar role
 * 3. Sinkronisasi state activeRole dengan URL
 *
 * Perbaikan yang telah dilakukan:
 * - Menghapus duplikasi useEffect dari Sidebar.tsx
 * - Optimalkan logika untuk mencegah infinite loop
 * - Tambahkan logging untuk debugging
 */
const RoleTabs = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { activeRole, setActiveRole } = useMenuStore();

  console.log("RoleTabs render:", { activeRole, pathname });

  // Update activeRole based on current URL when component mounts
  useEffect(() => {
    console.log("RoleTabs useEffect triggered:", { pathname, activeRole });

    // Only update if there's a mismatch between pathname and activeRole
    // This prevents unnecessary state updates and potential infinite loops
    const expectedRole = pathname.startsWith("/employer")
      ? "employer"
      : pathname.startsWith("/me")
      ? "employee"
      : null;

    if (expectedRole && expectedRole !== activeRole) {
      console.log("RoleTabs: Setting role to", expectedRole);
      setActiveRole(expectedRole);
    }
  }, [pathname, activeRole, setActiveRole]);

  const handleTabClick = (role: "employee" | "employer") => {
    console.log("RoleTabs handleTabClick called:", { role, activeRole });
    // Only update and navigate if the role is different from current active role
    if (activeRole !== role) {
      console.log("RoleTabs: Changing role from", activeRole, "to", role);
      setActiveRole(role);
      if (role === "employee") {
        console.log("RoleTabs: Navigating to /me");
        router.push("/me");
      } else {
        console.log("RoleTabs: Navigating to /employer/streams");
        router.push("/employer/streams");
      }
    } else {
      console.log("RoleTabs: Same role clicked, no action needed");
    }
  };

  return (
    <div className="flex p-1 bg-gray-100 rounded-lg mx-4 mb-4">
      <button
        onClick={() => handleTabClick("employee")}
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
          activeRole === "employee"
            ? "bg-[#F9140D] text-white shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Employee
      </button>
      <button
        onClick={() => handleTabClick("employer")}
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
          activeRole === "employer"
            ? "bg-[#F9140D] text-white shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Employer
      </button>
    </div>
  );
};

export default RoleTabs;
