"use client";
import { create } from "zustand";

type MenuProps = {
  sidebarIsOpen: boolean;
  headerIsOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setHeaderOpen: (open: boolean) => void;
};

const width = typeof window !== "undefined" ? window.innerWidth : 0;

export const useMenuStore = create<MenuProps>((set) => ({
  headerIsOpen: false,
  sidebarIsOpen: width > 768 ? true : false,
  setHeaderOpen: (open) => {
    set({ headerIsOpen: open });
  },
  setSidebarOpen: (open) => {
    set({ sidebarIsOpen: open });
  },
}));
