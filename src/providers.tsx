"use client";

import * as React from "react";
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { trustWallet, ledgerWallet } from "@rainbow-me/rainbowkit/wallets";
import { klaytn, klaytnBaobab } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, http } from "wagmi";

const { wallets } = getDefaultWallets();

const config = getDefaultConfig({
  appName: "LIFF DApp",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID, // 需要在 .env 文件中添加此环境变量
  wallets: [
    ...wallets,
    {
      groupName: "Other",
      wallets: [trustWallet, ledgerWallet],
    },
  ],
  chains: [klaytn, klaytnBaobab],
  transports: {
    [klaytn.id]: http("https://rpc.ankr.com/klaytn"),
    [klaytnBaobab.id]: http("https://rpc.ankr.com/klaytn_testnet"),
  },
  ssr: false, // 由于是 Vite 项目，设置为 false
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
