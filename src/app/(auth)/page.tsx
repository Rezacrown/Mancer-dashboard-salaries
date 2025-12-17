"use client";
import { useGetAuthenticated } from "@/libs/hooks/useGetAuthenticated";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthPage() {
  const router = useRouter();
  const { authenticated, address } = useGetAuthenticated();

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      {/* Left Side - Visual Branding & Storytelling */}
      <div className="hidden lg:flex w-[55%] relative items-center justify-center p-12 overflow-hidden bg-linear-to-br from-primary via-red-600 to-orange-600">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>

        {/* Animated Glow Blobs */}
        <div className="absolute top-[-20%] left-[-10%] w-125 h-125 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-150 h-150 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>

        {/* Main Floating Content */}
        <div className="relative z-10 w-full max-w-lg">
          {/* Glassmorphism Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/20 shadow-2xl relative">
            {/* Decorative Circle */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-yellow-400 rounded-full blur-xl opacity-60"></div>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center text-primary font-bold text-2xl transform -rotate-6">
                M
              </div>
              <div>
                <h2 className="text-white text-3xl font-bold tracking-tight">
                  Mancer
                </h2>
                <p className="text-red-100 font-medium tracking-wide opacity-90">
                  Salary Streaming Protocol
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Feature 1 */}
              <div className="bg-linear-to-r from-white/20 to-white/5 rounded-2xl p-4 flex items-center gap-5 border border-white/10 hover:bg-white/20 transition-all cursor-default">
                <div className="w-12 h-12 rounded-full bg-green-400/20 flex items-center justify-center text-green-300 border border-green-400/30">
                  <Zap size={24} fill="currentColor" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">
                    Real-time Salary
                  </p>
                  <p className="text-red-100 text-sm opacity-80">
                    Stream money every second, literally.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-linear-to-r from-white/20 to-white/5 rounded-2xl p-4 flex items-center gap-5 border border-white/10 hover:bg-white/20 transition-all cursor-default">
                <div className="w-12 h-12 rounded-full bg-blue-400/20 flex items-center justify-center text-blue-300 border border-blue-400/30">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">
                    Edu Chain Secured
                  </p>
                  <p className="text-red-100 text-sm opacity-80">
                    Immutable contracts & verified logic.
                  </p>
                </div>
              </div>
            </div>

            {/* Floating "Payment Received" Notification */}
            <div className="absolute -bottom-8 -left-8 bg-white text-gray-800 p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce duration-3000">
              <div className="bg-green-100 p-2 rounded-full text-green-600">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase">
                  Payment Received
                </p>
                <p className="text-sm font-bold">+ 0.00032 PHII</p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center relative">
            <h1 className="text-5xl font-bold text-white mb-4 leading-tight drop-shadow-sm">
              Future of Payroll <br />
              is{" "}
              <span className="text-yellow-300 underline decoration-wavy decoration-2 underline-offset-4">
                Fluid
              </span>
              .
            </h1>
            <p className="text-red-50 text-lg max-w-md mx-auto leading-relaxed">
              Join thousands of employees receiving their salary instantly,
              transparently, and automatically.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Connect Wallet */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center items-center p-8 lg:p-16 bg-[#F8F9FB] relative">
        <div className="w-full max-w-md space-y-10">
          <div className="text-center lg:text-left space-y-2">
            <div className="flex justify-center lg:justify-start items-center gap-3 mb-4 lg:hidden">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-red-200">
                M
              </div>
              <span className="text-2xl font-bold text-primary">mancer</span>
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Welcome Back!
            </h2>
            <p className="text-gray-500 text-lg">
              Connect your wallet to access your dashboard.
            </p>
          </div>

          {/* Connect wallet button */}
          <ConnectButton.Custom
            children={({
              openConnectModal,
              account,
              authenticationStatus,
              mounted,
              chain,
            }) => {
              const ready = mounted && authenticationStatus !== "loading";
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === "authenticated");

              if (!connected)
                return (
                  <button
                    disabled={connected}
                    onClick={() => openConnectModal()}
                    className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all duration-200 group relative overflow-hidden border-gray-200 bg-white hover:border-primary/30 hover:shadow-xl hover:shadow-red-100/50 hover:-translate-y-1 text-gray-900 hover:text-primary
                hover:bg-red-50/50 shadow-inner 
               `}
                  >
                    <div className="flex items-center gap-5 relative z-10 mx-auto">
                      <h3 className=" font-bold text-xl lg:text-2xl ">
                        Connect Wallet
                      </h3>
                    </div>
                  </button>
                );

              return (
                <div
                  className="w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all duration-200 group relative overflow-hidden bg-white border-primary/30 shadow-xl shadow-red-100/50 hover:-translate-y-1 text-primary
                hover:bg-red-50/50 text-center"
                >
                  <h3 className="mx-auto font-semibold"> Redirect...</h3>
                </div>
              );
            }}
          />

          <div className="text-center pt-8 border-t border-gray-100 mt-8">
            <div className="mt-6 flex justify-center gap-6 text-xs text-gray-400">
              <a href="#" className="hover:text-gray-600">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-600">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
