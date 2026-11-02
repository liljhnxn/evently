"use client";

import React from "react";
import { CalendarDays, Sparkles, Ticket, UserCheck } from "lucide-react";

interface DashboardStatsProps {
  totalEvents: number;
  openEvents: number;
  myRegistrationsCount: number;
  myCreatedEventsCount: number;
  isConnected: boolean;
}

export function DashboardStats({
  totalEvents,
  openEvents,
  myRegistrationsCount,
  myCreatedEventsCount,
  isConnected,
}: DashboardStatsProps) {
  const stats = [
    {
      label: "Total Events",
      value: totalEvents,
      subtext: "On-chain registered events",
      icon: CalendarDays,
      iconColor: "text-brand-purple",
      borderColor: "hover:border-brand-purple/40",
      bgGradient: "from-brand-purple/10 to-transparent",
    },
    {
      label: "Open Events",
      value: openEvents,
      subtext: "Ready for registration",
      icon: Sparkles,
      iconColor: "text-brand-green",
      borderColor: "hover:border-brand-green/40",
      bgGradient: "from-brand-green/10 to-transparent",
    },
    {
      label: "My Registrations",
      value: isConnected ? myRegistrationsCount : "—",
      subtext: isConnected ? "Events you're attending" : "Connect wallet to view",
      icon: Ticket,
      iconColor: "text-indigo-400",
      borderColor: "hover:border-indigo-500/40",
      bgGradient: "from-indigo-500/10 to-transparent",
    },
    {
      label: "Events Created by Me",
      value: isConnected ? myCreatedEventsCount : "—",
      subtext: isConnected ? "Organized by you" : "Connect wallet to view",
      icon: UserCheck,
      iconColor: "text-purple-400",
      borderColor: "hover:border-purple-500/40",
      bgGradient: "from-purple-500/10 to-transparent",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`p-5 rounded-2xl bg-surface-card border border-surface-border bg-gradient-to-br ${stat.bgGradient} transition-all duration-200 ${stat.borderColor} group`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-text-secondary">
                {stat.label}
              </span>
              <div className="p-2.5 rounded-xl bg-surface-raised border border-surface-border/50 group-hover:scale-105 transition-transform">
                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
                {stat.value}
              </span>
            </div>
            <p className="mt-1 text-xs text-text-muted">{stat.subtext}</p>
          </div>
        );
      })}
    </div>
  );
}

