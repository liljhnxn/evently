"use client";

import React, { useState, useMemo } from "react";
import { EventItemData, EventStatus } from "@/lib/contracts";
import { EventCard } from "./EventCard";
import { Search, SlidersHorizontal, CalendarX, Sparkles } from "lucide-react";

interface ExploreEventsProps {
  events: EventItemData[];
  userAddress?: string;
  userRegisteredEventIds: Set<number>;
  onRegister: (eventId: bigint) => void;
  isRegistering: boolean;
  registeringId: bigint | null;
  onOpenCreateModal?: () => void;
}

export function ExploreEvents({
  events,
  userAddress,
  userRegisteredEventIds,
  onRegister,
  isRegistering,
  registeringId,
  onOpenCreateModal,
}: ExploreEventsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | EventStatus>("ALL");

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      // Status filter
      if (statusFilter !== "ALL" && ev.status !== statusFilter) {
        return false;
      }
      // Search filter
      if (searchTerm.trim() !== "") {
        const query = searchTerm.toLowerCase();
        const matchesName = ev.name.toLowerCase().includes(query);
        const matchesVenue = ev.venue.toLowerCase().includes(query);
        const matchesDesc = ev.description.toLowerCase().includes(query);
        return matchesName || matchesVenue || matchesDesc;
      }
      return true;
    });
  }, [events, statusFilter, searchTerm]);

  return (
    <section id="explore" className="mb-14">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-brand-purple text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover Gatherings</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Explore Events
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Browse upcoming blockchain, tech, and community sessions. Free to join.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {[
            { label: "All", value: "ALL" },
            { label: "Open", value: EventStatus.Open },
            { label: "Full", value: EventStatus.Full },
            { label: "Completed", value: EventStatus.Completed },
            { label: "Cancelled", value: EventStatus.Cancelled },
          ].map((tab) => {
            const isActive = statusFilter === tab.value;
            return (
              <button
                key={tab.label}
                onClick={() => setStatusFilter(tab.value as any)}
                className={`px-3 py-1.5 rounded-xl font-medium transition ${
                  isActive
                    ? "bg-brand-purple text-white shadow-sm shadow-purple-900/40"
                    : "bg-surface-card border border-surface-border text-text-secondary hover:text-white hover:border-brand-purple/40"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by event title, venue, or keywords..."
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-card border border-surface-border text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-brand-purple transition"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-text-muted hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id.toString()}
              event={event}
              userAddress={userAddress}
              isRegistered={userRegisteredEventIds.has(Number(event.id))}
              onRegister={onRegister}
              isRegistering={isRegistering}
              registeringId={registeringId}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-surface-border bg-surface-card/40 p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-surface-raised flex items-center justify-center mx-auto mb-3">
            <CalendarX className="w-6 h-6 text-text-muted" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">
            No events found
          </h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto mb-5">
            {searchTerm || statusFilter !== "ALL"
              ? "Try adjusting your search query or status filter."
              : "Be the first to host an experience on Botchain Testnet!"}
          </p>
          {onOpenCreateModal && (
            <button
              onClick={onOpenCreateModal}
              className="px-4 py-2 rounded-xl bg-surface-raised border border-brand-purple/40 text-brand-purple hover:bg-brand-purple hover:text-white text-xs font-semibold transition"
            >
              Create an Event
            </button>
          )}
        </div>
      )}
    </section>
  );
}

