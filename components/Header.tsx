"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { botchainTestnet } from "@/lib/chains";
import { shortenAddress } from "@/lib/utils";
import { Calendar, Wallet, LogOut, ChevronDown, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";

export function Header() {
  const { address, isConnected, status } = useAccount();
  const { connectors, connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isCorrectNetwork = chainId === botchainTestnet.id;

  const handleConnect = () => {
    // Prefer MetaMask / Injected connector
    const connector = connectors.find((c) => c.name.toLowerCase().includes("metamask")) || connectors[0];
    if (connector) {
      connect({ connector });
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-surface-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-brand-purple to-brand-green flex items-center justify-center shadow-lg shadow-purple-900/30">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight text-white font-mono">
                Event<span className="text-brand-purple">ly</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-brand-purple/20 text-purple-300 border border-brand-purple/30">
                Testnet
              </span>
            </div>
            <p className="text-xs text-text-secondary hidden sm:block">
              Find your next experience.
            </p>
          </div>
        </div>

        {/* Network & Wallet Controls */}
        <div className="flex items-center gap-3">
          {mounted && isConnected && (
            <div className="hidden md:flex items-center">
              {isCorrectNetwork ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Botchain Testnet (968)
                </div>
              ) : (
                <button
                  onClick={() => switchChain({ chainId: botchainTestnet.id })}
                  disabled={isSwitching}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-950/40 border border-amber-800/40 text-amber-300 text-xs font-medium hover:bg-amber-900/40 transition"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  {isSwitching ? "Switching..." : "Switch to Botchain"}
                </button>
              )}
            </div>
          )}

          {mounted ? (
            isConnected && address ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-card border border-surface-border hover:border-brand-purple/50 text-white text-sm font-medium transition-all shadow-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-brand-green" />
                  <span className="font-mono">{shortenAddress(address)}</span>
                  <ChevronDown className="w-4 h-4 text-text-secondary" />
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-xl bg-surface-card border border-surface-border p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-surface-border">
                      <p className="text-xs text-text-muted">Connected Account</p>
                      <p className="text-xs font-mono font-medium text-text-primary truncate">
                        {address}
                      </p>
                    </div>

                    {!isCorrectNetwork && (
                      <button
                        onClick={() => {
                          switchChain({ chainId: botchainTestnet.id });
                          setDropdownOpen(false);
                        }}
                        className="w-full mt-1.5 flex items-center gap-2 px-3 py-2 text-xs font-medium text-amber-400 hover:bg-amber-950/30 rounded-lg transition"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        Switch to Botchain (968)
                      </button>
                    )}

                    <button
                      onClick={() => {
                        disconnect();
                        setDropdownOpen(false);
                      }}
                      className="w-full mt-1 flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-950/30 rounded-lg transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Disconnect Wallet
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm font-medium shadow-md shadow-purple-950/40 hover:shadow-purple-900/60 active:scale-95 transition-all"
              >
                <Wallet className="w-4 h-4" />
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
            )
          ) : (
            <div className="w-32 h-10 rounded-xl bg-surface-card animate-pulse" />
          )}
        </div>
      </div>
    </header>
  );
}

