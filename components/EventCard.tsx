"use client";

import React from "react";
import { EventItemData, EventStatus } from "@/lib/contracts";
import { formatEventDate, getStatusBadge, shortenAddress } from "@/lib/utils";
import { MapPin, Calendar, Users, User, Check, ExternalLink, Loader2 } from "lucide-react";

interface EventCardProps {
  event: EventItemData;
  userAddress?: string;
  isRegistered?: boolean;
  onRegister?: (eventId: bigint) => void;
  isRegistering?: boolean;
  registeringId?: bigint | null;
}

export function EventCard({
  event,
  userAddress,
  isRegistered = false,
  onRegister,
  isRegistering = false,
  registeringId = null,
}: EventCardProps) {
  const badge = getStatusBadge(event.status);
  const isOrganizer = userAddress && event.organizer.toLowerCase() === userAddress.toLowerCase();
  const availableSlots = Number(event.maxAttendees) - Number(event.attendeeCount);
  const percentageFilled = Math.min(
    100,
    Math.round((Number(event.attendeeCount) / Number(event.maxAttendees)) * 100)
  );

  const isOpen = event.status === EventStatus.Open;
  const isFull = event.status === EventStatus.Full;
  const isCancelled = event.status === EventStatus.Cancelled;
  const isCompleted = event.status === EventStatus.Completed;

  const isCurrentActionPending = isRegistering && registeringId === event.id;

  return (
    <div className="flex flex-col justify-between rounded-2xl bg-surface-card border border-surface-border p-5 sm:p-6 glow-card transition-all">
      {/* Top Header: Status badge & Free Tag */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.bgColor}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor}`} />
            {badge.label}
          </span>

          <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-surface-raised border border-surface-border text-emerald-400">
            Free Entry
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-bold text-white tracking-tight mb-2 line-clamp-1">
          {event.name}
        </h3>
        <p className="text-xs sm:text-sm text-text-secondary line-clamp-2 mb-4 leading-relaxed">
          {event.description || "No description provided for this event."}
        </p>

        {/* Details: Date, Venue, Organizer */}
        <div className="space-y-2.5 py-3 border-t border-b border-surface-border/60 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-purple flex-shrink-0" />
            <span className="text-text-primary font-medium">
              {formatEventDate(event.eventDate)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-green flex-shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>

          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-text-muted flex-shrink-0" />
            <span className="font-mono text-text-muted">
              By {shortenAddress(event.organizer)}
              {isOrganizer && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-purple-900/40 text-purple-300 border border-purple-700/50">
                  You
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Capacity Progress Bar */}
        <div className="mt-4 mb-5">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="flex items-center gap-1.5 text-text-muted">
              <Users className="w-3.5 h-3.5" />
              <span>Attendees</span>
            </span>
            <span className="font-mono font-medium text-text-primary">
              {event.attendeeCount.toString()} / {event.maxAttendees.toString()}
              <span className="text-text-muted text-[11px] ml-1">
                ({availableSlots > 0 ? `${availableSlots} left` : "0 left"})
              </span>
            </span>
          </div>
          <div className="w-full h-1.5 bg-surface-raised rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isFull
                  ? "bg-amber-500"
                  : isCancelled
                  ? "bg-rose-500"
                  : isCompleted
                  ? "bg-purple-500"
                  : "bg-gradient-to-r from-brand-purple to-brand-green"
              }`}
              style={{ width: `${percentageFilled}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-2">
        {isRegistered ? (
          <div className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs font-semibold">
            <Check className="w-4 h-4" />
            Registered
          </div>
        ) : isCancelled ? (
          <div className="w-full text-center py-2.5 px-4 rounded-xl bg-rose-950/20 border border-rose-900/30 text-rose-400/80 text-xs font-medium">
            Event Cancelled
          </div>
        ) : isCompleted ? (
          <div className="w-full text-center py-2.5 px-4 rounded-xl bg-purple-950/20 border border-purple-900/30 text-purple-400/80 text-xs font-medium">
            Event Completed
          </div>
        ) : isFull ? (
          <div className="w-full text-center py-2.5 px-4 rounded-xl bg-surface-raised border border-surface-border text-amber-400/80 text-xs font-medium">
            Capacity Full
          </div>
        ) : (
          <button
            onClick={() => onRegister && onRegister(event.id)}
            disabled={!isOpen || isCurrentActionPending}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-purple hover:bg-brand-purple-hover active:scale-[0.98] text-white text-xs font-semibold shadow-md shadow-purple-950/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCurrentActionPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Registering...
              </>
            ) : (
              "Register Free"
            )}
          </button>
        )}
      </div>
    </div>
  );
}

