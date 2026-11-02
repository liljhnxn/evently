import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { EventStatus } from "./contracts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenAddress(address?: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatEventDate(timestampInSeconds: bigint | number): string {
  const ts = typeof timestampInSeconds === "bigint" ? Number(timestampInSeconds) : timestampInSeconds;
  if (!ts || isNaN(ts)) return "TBD";
  const date = new Date(ts * 1000);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function getStatusBadge(status: EventStatus) {
  switch (status) {
    case EventStatus.Open:
      return {
        label: "Open",
        bgColor: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
        dotColor: "bg-emerald-400",
      };
    case EventStatus.Full:
      return {
        label: "Full",
        bgColor: "bg-amber-500/15 border-amber-500/30 text-amber-400",
        dotColor: "bg-amber-400",
      };
    case EventStatus.Cancelled:
      return {
        label: "Cancelled",
        bgColor: "bg-rose-500/15 border-rose-500/30 text-rose-400",
        dotColor: "bg-rose-400",
      };
    case EventStatus.Completed:
      return {
        label: "Completed",
        bgColor: "bg-purple-500/15 border-purple-500/30 text-purple-400",
        dotColor: "bg-purple-400",
      };
    default:
      return {
        label: "Unknown",
        bgColor: "bg-gray-500/15 border-gray-500/30 text-gray-400",
        dotColor: "bg-gray-400",
      };
  }
}

