"use client";

import { useAccountModal } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";

export const useWallet = () => {
  const account = useAccount();
  const { openAccountModal } = useAccountModal();
  const { disconnect } = useDisconnect();

  return {
    ...account,
    disconnect,
    openAccountModal,
  };
};
