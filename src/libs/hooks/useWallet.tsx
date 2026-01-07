"use client";

import { useAccountModal } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";

import { USER_PROFILE } from "@/constants/Mock";
import { Address } from "viem";

export const useWallet = () => {
  const account = useAccount();
  const { openAccountModal } = useAccountModal();
  const { disconnect } = useDisconnect();

  return {
    ...account,
    address: USER_PROFILE.address as Address, // for mock implementaion. must be comment in production
    disconnect,
    openAccountModal,
  };
};
