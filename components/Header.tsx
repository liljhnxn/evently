"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { botchainMainnet } from "@/lib/chains";
import { shortenAddress } from "@/lib/utils";
import { Calendar, Wallet, LogOut, ChevronDown, AlertTriangle, ExternalLink, Globe } from "lucide-react";

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

  const isCorrectNetwork = chainId === botchainMainnet.id;

  const handleConnect = () => {
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
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain"
                  className="w-3.5 h-3.5 rounded object-contain"
                />
                BOT Chain
              </span>
            </div>
            <p className="text-xs text-text-secondary hidden sm:block">
              Find your next experience.
            </p>
          </div>
        </div>

        {/* Network & Ecosystem Controls */}
        <div className="flex items-center gap-3">
          {/* BOT Chain Website Quick Link */}
          <a
            href="https://botchain.ai"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-card border border-surface-border hover:border-emerald-500/40 text-text-secondary hover:text-white text-xs font-medium transition group"
          >
            <img
              src="/botchain-logo.png"
              alt="BOT Chain"
              className="w-4 h-4 rounded object-contain group-hover:scale-110 transition-transform"
            />
            <span>Website</span>
            <ExternalLink className="w-3 h-3 text-emerald-400" />
          </a>

          {/* BOT Chain Explorer Quick Link */}
          <a
            href="https://scan.botchain.ai"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-card border border-surface-border hover:border-brand-purple/40 text-text-secondary hover:text-white text-xs font-medium transition group"
          >
            <img
              src="/botchain-logo.png"
              alt="BOT Chain"
              className="w-4 h-4 rounded object-contain group-hover:scale-110 transition-transform"
            />
            <span>Explorer</span>
            <ExternalLink className="w-3 h-3 text-brand-purple" />
          </a>

          {mounted && isConnected && (
            <div className="hidden md:flex items-center">
              {isCorrectNetwork ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs font-medium">
                  <img
                    src="/botchain-logo.png"
                    alt="BOT Chain"
                    className="w-3.5 h-3.5 rounded object-contain"
                  />
                  BOT Chain (677)
                </div>
              ) : (
                <button
                  onClick={() => switchChain({ chainId: botchainMainnet.id })}
                  disabled={isSwitching}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-950/40 border border-amber-800/40 text-amber-300 text-xs font-medium hover:bg-amber-900/40 transition"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  {isSwitching ? "Switching..." : "Switch to BOT Chain"}
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
                    className="absolute right-0 mt-2 w-64 rounded-xl bg-surface-card border border-surface-border p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100"
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
                          switchChain({ chainId: botchainMainnet.id });
                          setDropdownOpen(false);
                        }}
                        className="w-full mt-1.5 flex items-center gap-2 px-3 py-2 text-xs font-medium text-emerald-400 hover:bg-emerald-950/30 rounded-lg transition"
                      >
                        <img
                          src="/botchain-logo.png"
                          alt="BOT Chain"
                          className="w-3.5 h-3.5 rounded object-contain"
                        />
                        Switch to BOT Chain (677)
                      </button>
                    )}

                    <a
                      href="https://botchain.ai"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full mt-1 flex items-center justify-between px-3 py-2 text-xs font-medium text-text-secondary hover:text-white hover:bg-surface-raised rounded-lg transition"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src="/botchain-logo.png"
                          alt="BOT Chain"
                          className="w-3.5 h-3.5 rounded object-contain"
                        />
                        <span>BOT Chain Website</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <a
                      href={`https://scan.botchain.ai/address/${address}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full mt-1 flex items-center justify-between px-3 py-2 text-xs font-medium text-text-secondary hover:text-white hover:bg-surface-raised rounded-lg transition"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src="/botchain-logo.png"
                          alt="BOT Chain"
                          className="w-3.5 h-3.5 rounded object-contain"
                        />
                        <span>View on Explorer</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

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
