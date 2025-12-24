import "@/app/globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Provider from "@/libs/Provider";
import Sidebar from "@/components/shared/Sidebar";
import Header from "@/components/shared/Header";
import { WalletGuardProvider } from "@/components/guard/WalletGuardProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mancer Dashboard",
  description: "Mancer Saleries Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>
          <WalletGuardProvider>
            <div className="flex h-screen bg-[#F8F9FB] font-sans text-slate-800 overflow-hidden">
              <Sidebar />
              <main className="flex-1 flex flex-col h-full overflow-hidden">
                <Header />
                <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                  {children}
                </div>
              </main>
            </div>
          </WalletGuardProvider>
        </Provider>
      </body>
    </html>
  );
}
