"use client";

import React from "react";
import { Loader2, CheckCircle2, AlertCircle, ExternalLink, X } from "lucide-react";
import { getExplorerTxUrl } from "@/lib/utils";

export interface TxState {
  type: "idle" | "pending" | "success" | "error";
  title?: string;
  message?: string;
  txHash?: string;
}

interface TxNotificationProps {
  txState: TxState;
  onClose: () => void;
}

export function TxNotification({ txState, onClose }: TxNotificationProps) {
  if (txState.type === "idle") return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5">
      <div
        className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-lg ${
          txState.type === "pending"
            ? "bg-surface-card/95 border-brand-purple/40 text-purple-200"
            : txState.type === "success"
            ? "bg-surface-card/95 border-emerald-500/40 text-emerald-200"
            : "bg-surface-card/95 border-rose-500/40 text-rose-200"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex-shrink-0">
            {txState.type === "pending" && (
              <Loader2 className="w-5 h-5 text-brand-purple animate-spin" />
            )}
            {txState.type === "success" && (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            )}
            {txState.type === "error" && (
              <AlertCircle className="w-5 h-5 text-rose-400" />
            )}
          </div>

          <div className="flex-1 space-y-1">
            <h4 className="text-sm font-bold text-white">
              {txState.title ||
                (txState.type === "pending"
                  ? "Broadcasting Transaction"
                  : txState.type === "success"
                  ? "Transaction Confirmed"
                  : "Transaction Failed")}
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              {txState.message}
            </p>

            {txState.txHash && (
              <div className="pt-1.5">
                <a
                  href={getExplorerTxUrl(txState.txHash)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-purple hover:underline"
                >
                  View on BotchainScan Explorer
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-text-muted hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

