"use client";
import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { metaMaskWallet, okxWallet } from "@rainbow-me/rainbowkit/wallets";

import { WagmiProvider } from "wagmi";
import { eduChainTestnet } from "wagmi/chains";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: "Mancer Dashboard",
  projectId: "YOUR_PROJECT_ID",
  chains: [eduChainTestnet],
  ssr: true, // If your dApp uses server side rendering (SSR)
  wallets: [
    {
      groupName: "Recommendation",
      wallets: [metaMaskWallet, okxWallet],
    },
  ],
});

export const queryClient = new QueryClient();

const Provider = ({ children }: React.PropsWithChildren) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Provider;
