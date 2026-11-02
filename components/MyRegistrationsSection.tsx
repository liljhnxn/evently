"use client";

import React from "react";
import { EventItemData } from "@/lib/contracts";
import { formatEventDate, getStatusBadge, shortenAddress } from "@/lib/utils";
import { Calendar, MapPin, Ticket, ExternalLink } from "lucide-react";

interface MyRegistrationsSectionProps {
  events: EventItemData[];
  isConnected: boolean;
  onExploreClick: () => void;
}

export function MyRegistrationsSection({
  events,
  isConnected,
  onExploreClick,
}: MyRegistrationsSectionProps) {
  if (!isConnected) {
    return null;
  }

  return (
    <section id="my-registrations" className="mb-14">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Registrations
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Events you have claimed free passes for with your connected wallet.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-brand-purple/15 text-purple-300 border border-brand-purple/30 text-xs font-mono font-medium">
          {events.length} pass{events.length === 1 ? "" : "es"}
        </span>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event) => {
            const badge = getStatusBadge(event.status);

            return (
              <div
                key={event.id.toString()}
                className="rounded-2xl bg-surface-card border border-surface-border p-5 flex flex-col justify-between glow-card"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.bgColor}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor}`} />
                      {badge.label}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-900/40">
                      Confirmed RSVP
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 line-clamp-1">
                    {event.name}
                  </h3>

                  <div className="space-y-2 py-2 text-xs text-text-secondary">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-brand-purple flex-shrink-0" />
                      <span className="font-medium text-text-primary">
                        {formatEventDate(event.eventDate)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-brand-green flex-shrink-0" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-surface-border/60 flex items-center justify-between text-xs text-text-muted">
                  <span className="font-mono">
                    Host: {shortenAddress(event.organizer)}
                  </span>
                  <span className="font-mono text-text-secondary">
                    Pass #{event.id.toString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-surface-border bg-surface-card/40 p-8 text-center">
          <Ticket className="w-8 h-8 text-text-muted mx-auto mb-2" />
          <p className="text-sm text-text-secondary mb-3">
            You haven&apos;t registered for any events yet.
          </p>
          <button
            onClick={onExploreClick}
            className="px-4 py-2 rounded-xl bg-surface-card border border-brand-purple/40 text-brand-purple hover:bg-brand-purple hover:text-white text-xs font-semibold transition"
          >
            Explore Events & Register Free
          </button>
        </div>
      )}
    </section>
  );
}

