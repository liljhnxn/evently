"use client";

import React, { useState } from "react";
import { PlusCircle, Calendar, MapPin, Users, FileText, CheckCircle2, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { getExplorerTxUrl } from "@/lib/utils";

interface CreateEventSectionProps {
  isConnected: boolean;
  onCreateEvent: (data: {
    name: string;
    description: string;
    venue: string;
    eventDate: bigint;
    maxAttendees: bigint;
  }) => Promise<{ txHash?: string; eventId?: bigint } | undefined>;
  isCreating: boolean;
}

export function CreateEventSection({
  isConnected,
  onCreateEvent,
  isCreating,
}: CreateEventSectionProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [maxAttendees, setMaxAttendees] = useState("50");
  const [formError, setFormError] = useState<string | null>(null);

  // Success result state
  const [successInfo, setSuccessInfo] = useState<{
    txHash?: string;
    eventId?: bigint;
    name: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!isConnected) {
      setFormError("Please connect your wallet first to create an event.");
      return;
    }

    if (!name.trim()) {
      setFormError("Please provide an event name.");
      return;
    }

    if (!venue.trim()) {
      setFormError("Please provide a venue or link.");
      return;
    }

    if (!dateTime) {
      setFormError("Please select the date and time for your event.");
      return;
    }

    const selectedTs = Math.floor(new Date(dateTime).getTime() / 1000);
    const nowTs = Math.floor(Date.now() / 1000);

    if (selectedTs <= nowTs) {
      setFormError("Event date and time must be set in the future.");
      return;
    }

    const capacityNum = parseInt(maxAttendees, 10);
    if (isNaN(capacityNum) || capacityNum <= 0) {
      setFormError("Maximum attendees must be at least 1.");
      return;
    }

    try {
      const res = await onCreateEvent({
        name: name.trim(),
        description: description.trim(),
        venue: venue.trim(),
        eventDate: BigInt(selectedTs),
        maxAttendees: BigInt(capacityNum),
      });

      if (res) {
        setSuccessInfo({
          txHash: res.txHash,
          eventId: res.eventId,
          name: name.trim(),
        });
        // Reset form
        setName("");
        setDescription("");
        setVenue("");
        setDateTime("");
        setMaxAttendees("50");
      }
    } catch (err: any) {
      console.error(err);
      setFormError(err?.message || "Failed to create event transaction.");
    }
  };

  return (
    <section id="create" className="mb-14">
      <div className="rounded-3xl bg-surface-card border border-surface-border p-6 sm:p-8 lg:p-10 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-brand-purple/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-brand-green/10 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-brand-green text-xs font-semibold uppercase tracking-wider mb-1">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Organize with Evently</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            Create an Event
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary max-w-2xl mb-8">
            Host a meetup, workshop, hackathon, or seminar on BOT Chain. Set capacity, track registrations on-chain, and manage attendees.
          </p>

          {/* Success Banner if newly created */}
          {successInfo && (
            <div className="mb-8 p-5 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 animate-in fade-in zoom-in-95">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">
                    Event Created Successfully!
                  </h4>
                  <p className="text-xs text-emerald-300/90">
                    &ldquo;{successInfo.name}&rdquo; is now live on the Botchain ledger.
                  </p>
                  {successInfo.eventId && (
                    <p className="text-xs text-text-secondary">
                      Assigned Event ID:{" "}
                      <span className="font-mono font-bold text-emerald-400">
                        #{successInfo.eventId.toString()}
                      </span>
                    </p>
                  )}
                  {successInfo.txHash && (
                    <div className="pt-2">
                      <a
                        href={getExplorerTxUrl(successInfo.txHash)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline"
                      >
                        View on BotchainScan Explorer
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-900/50 flex items-center gap-2.5 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Event Name */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                  Event Name <span className="text-brand-purple">*</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Botchain Developer Meetup #1"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-raised border border-surface-border text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-brand-purple transition"
                  />
                </div>
              </div>

              {/* Venue */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                  Venue or Location <span className="text-brand-purple">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="e.g. Community Space or Google Meet URL"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-raised border border-surface-border text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-brand-purple transition"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                Short Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Briefly describe what attendees should anticipate, agendas, prerequisites, etc."
                className="w-full px-4 py-2.5 rounded-xl bg-surface-raised border border-surface-border text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-brand-purple transition resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Event Date & Time */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                  Event Date & Time <span className="text-brand-purple">*</span>
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-raised border border-surface-border text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-brand-purple transition scheme-dark"
                  />
                </div>
              </div>

              {/* Maximum Attendees */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                  Maximum Attendees Limit <span className="text-brand-purple">*</span>
                </label>
                <div className="relative">
                  <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="number"
                    min="1"
                    max="100000"
                    value={maxAttendees}
                    onChange={(e) => setMaxAttendees(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-raised border border-surface-border text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-brand-purple transition"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isCreating}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-brand-green hover:bg-brand-green-hover text-white text-sm font-semibold shadow-lg shadow-emerald-950/40 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Confirming on BOT Chain...
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    Create Event
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

