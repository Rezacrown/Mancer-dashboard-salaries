"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

import { useSwitchChain } from "wagmi";
import { eduChainTestnet } from "viem/chains";
import { useWallet } from "@/libs/hooks/useWallet";

export function WalletGuardProvider({
  children,
  redirectTo = "/", // default redirect
}: {
  children: React.ReactNode;
  redirectTo?: string;
}) {
  const { status, chainId, isConnecting, isReconnecting } = useWallet();
  const { switchChain } = useSwitchChain();

  const [mounted, setMounted] = useState<boolean>(false);

  // checking wagmi mounted behavior
  useEffect(() => {
    if (isConnecting || isReconnecting) setMounted(true);
  }, [isConnecting, isReconnecting]);

  useEffect(() => {
    // check chain id if wrong switch to EduchainTestnet
    if (chainId != eduChainTestnet.id) {
      switchChain({
        chainId: eduChainTestnet.id,
      });
    }
  }, [chainId]);

  if (!mounted) return null;
  if (status == "connecting" || status == "reconnecting") return null;

  if (status == "disconnected" && mounted) {
    redirect(redirectTo);
  }

  if (status == "connected" && chainId == eduChainTestnet.id)
    return <>{children}</>;
}
