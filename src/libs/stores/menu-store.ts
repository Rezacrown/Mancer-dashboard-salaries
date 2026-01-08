"use client";
import { create } from "zustand";

type MenuProps = {
  sidebarIsOpen: boolean;
  headerIsOpen: boolean;
  activeRole: "employee" | "employer";
  setSidebarOpen: (open: boolean) => void;
  setHeaderOpen: (open: boolean) => void;
  setActiveRole: (role: "employee" | "employer") => void;
};

const width = typeof window !== "undefined" ? window.innerWidth : 0;

export const useMenuStore = create<MenuProps>((set) => ({
  headerIsOpen: false,
  sidebarIsOpen: width > 768 ? true : false,
  activeRole: "employer",
  setHeaderOpen: (open) => {
    set({ headerIsOpen: open });
  },
  setSidebarOpen: (open) => {
    set({ sidebarIsOpen: open });
  },
  setActiveRole: (role) => {
    console.log("menu-store: setActiveRole called:", {
      role,
      currentActiveRole: useMenuStore.getState().activeRole,
    });
    set({ activeRole: role });
  },
}));
