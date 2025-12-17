"use client";

import { useAccountModal } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { eduChainTestnet } from "wagmi/chains";

export const useGetAuthenticated = () => {
  const { isConnected, address, chainId, chain } = useAccount();
  const { openAccountModal } = useAccountModal();
  const { disconnect } = useDisconnect();

  const authenticated =
    isConnected && !!address && chainId === eduChainTestnet.id;

  return {
    authenticated,
    disconnect,
    chain,
    address,
    openAccountModal,
  };
};
