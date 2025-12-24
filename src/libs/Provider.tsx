"use client";
import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { metaMaskWallet, okxWallet } from "@rainbow-me/rainbowkit/wallets";

import { http, WagmiProvider, createConfig } from "wagmi";
import { eduChainTestnet } from "wagmi/chains";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export const wagmiConfig = getDefaultConfig({
  appName: "Mancer Dashboard",
  projectId: "YOUR_PROJECT_ID",
  chains: [eduChainTestnet],
  transports: {
    [eduChainTestnet.id]: http(),
  },
  syncConnectedChain: true,
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
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact">{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Provider;
