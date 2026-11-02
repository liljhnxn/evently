"use client";

import React, { useState } from "react";
import { EventItemData, EventStatus } from "@/lib/contracts";
import { formatEventDate, getStatusBadge } from "@/lib/utils";
import {
  Calendar,
  MapPin,
  Users,
  XCircle,
  CheckCircle,
  Loader2,
  AlertTriangle,
  FolderOpen,
} from "lucide-react";

interface MyEventsSectionProps {
  events: EventItemData[];
  isConnected: boolean;
  onCancelEvent: (eventId: bigint) => Promise<void>;
  onCompleteEvent: (eventId: bigint) => Promise<void>;
  isProcessingAction: boolean;
  actionEventId: bigint | null;
  onScrollToCreate: () => void;
}

export function MyEventsSection({
  events,
  isConnected,
  onCancelEvent,
  onCompleteEvent,
  isProcessingAction,
  actionEventId,
  onScrollToCreate,
}: MyEventsSectionProps) {
  const [confirmCancelId, setConfirmCancelId] = useState<bigint | null>(null);

  if (!isConnected) {
    return (
      <section id="my-events" className="mb-14">
        <h2 className="text-2xl font-bold text-white mb-2">My Created Events</h2>
        <div className="rounded-2xl border border-surface-border bg-surface-card p-8 text-center">
          <p className="text-sm text-text-secondary">
            Connect your wallet to manage events you have created.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="my-events" className="mb-14">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Events Created by Me
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Manage attendance limits, cancel sessions, or mark past events as completed.
          </p>
        </div>
        <button
          onClick={onScrollToCreate}
          className="px-3.5 py-1.5 rounded-xl bg-surface-card border border-brand-purple/40 text-brand-purple hover:bg-brand-purple hover:text-white text-xs font-semibold transition"
        >
          + Host New
        </button>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {events.map((event) => {
            const badge = getStatusBadge(event.status);
            const availableSlots = Number(event.maxAttendees) - Number(event.attendeeCount);
            const isPendingThis = isProcessingAction && actionEventId === event.id;
            const canManage =
              event.status !== EventStatus.Cancelled &&
              event.status !== EventStatus.Completed;

            return (
              <div
                key={event.id.toString()}
                className="rounded-2xl bg-surface-card border border-surface-border p-5 sm:p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.bgColor}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor}`} />
                      {badge.label}
                    </span>
                    <span className="text-xs font-mono text-text-muted">
                      ID #{event.id.toString()}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1.5">
                    {event.name}
                  </h3>
                  <p className="text-xs text-text-secondary line-clamp-2 mb-4">
                    {event.description || "No description provided."}
                  </p>

                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-surface-raised border border-surface-border/60 text-xs text-text-secondary mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-brand-purple flex-shrink-0" />
                      <span className="truncate">{formatEventDate(event.eventDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-brand-green flex-shrink-0" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                  </div>

                  {/* Attendance Stats */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-text-muted flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        <span>Registered Attendees</span>
                      </span>
                      <span className="font-mono font-medium text-text-primary">
                        {event.attendeeCount.toString()} / {event.maxAttendees.toString()} (
                        {availableSlots} spots available)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-raised rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-purple to-brand-green rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            (Number(event.attendeeCount) / Number(event.maxAttendees)) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Organizer Action Buttons */}
                <div className="pt-3 border-t border-surface-border flex items-center justify-between gap-3">
                  {canManage ? (
                    confirmCancelId === event.id ? (
                      <div className="flex items-center gap-2 w-full justify-between animate-in fade-in">
                        <span className="text-xs text-rose-300 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Confirm cancel?
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              onCancelEvent(event.id);
                              setConfirmCancelId(null);
                            }}
                            disabled={isProcessingAction}
                            className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
                          >
                            Yes, Cancel
                          </button>
                          <button
                            onClick={() => setConfirmCancelId(null)}
                            className="px-2.5 py-1 rounded-lg bg-surface-raised text-text-secondary text-xs"
                          >
                            No
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => setConfirmCancelId(event.id)}
                          disabled={isPendingThis}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-raised hover:bg-rose-950/40 border border-surface-border hover:border-rose-800/40 text-text-secondary hover:text-rose-400 text-xs font-medium transition"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Cancel Event
                        </button>

                        <button
                          onClick={() => onCompleteEvent(event.id)}
                          disabled={isPendingThis}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-800/40 text-purple-300 text-xs font-medium transition"
                        >
                          {isPendingThis ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CheckCircle className="w-3.5 h-3.5" />
                          )}
                          Mark Completed
                        </button>
                      </>
                    )
                  ) : (
                    <span className="text-xs text-text-muted italic">
                      This event is finalized ({badge.label.toLowerCase()}).
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-surface-border bg-surface-card p-10 text-center">
          <FolderOpen className="w-8 h-8 text-text-muted mx-auto mb-2" />
          <p className="text-sm text-text-secondary mb-3">
            You haven&apos;t created any events yet.
          </p>
          <button
            onClick={onScrollToCreate}
            className="px-4 py-2 rounded-xl bg-brand-green hover:bg-brand-green-hover text-white text-xs font-semibold transition"
          >
            Create Your First Event
          </button>
        </div>
      )}
    </section>
  );
}

