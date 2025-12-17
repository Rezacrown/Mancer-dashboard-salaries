import "@/app/globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Provider from "@/libs/Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mancer Login Page",
  description: "Mancer Login Screen",
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
          <div className="flex h-screen bg-[#F8F9FB] font-sans text-slate-800 overflow-hidden">
            <main className="flex-1 flex flex-col h-full overflow-hidden">
              {children}
            </main>
          </div>
        </Provider>
      </body>
    </html>
  );
}
