"use client";
import { create } from "zustand";

interface StreamState {
  activeStreamId: bigint | null;
  setActiveStreamId: (streamId: bigint | null) => void;
  clearActiveStreamId: () => void;
}

export const useStreamStore = create<StreamState>((set) => ({
  activeStreamId: null,
  setActiveStreamId: (streamId) => {
    set({ activeStreamId: streamId });
  },
  clearActiveStreamId: () => {
    set({ activeStreamId: null });
  },
}));
