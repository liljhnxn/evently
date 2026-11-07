"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  usePublicClient,
} from "wagmi";
import { Header } from "@/components/Header";
import { DashboardStats } from "@/components/DashboardStats";
import { ExploreEvents } from "@/components/ExploreEvents";
import { CreateEventSection } from "@/components/CreateEventSection";
import { MyEventsSection } from "@/components/MyEventsSection";
import { MyRegistrationsSection } from "@/components/MyRegistrationsSection";
import { TxNotification, TxState } from "@/components/TxNotification";
import {
  EVENTLY_ABI,
  DEFAULT_CONTRACT_ADDRESS,
  EventItemData,
  EventStatus,
} from "@/lib/contracts";
import { Calendar, Compass, Plus, BookmarkCheck, LayoutDashboard, Globe, ExternalLink, ShieldCheck, Zap } from "lucide-react";

// Initial sample events to display rich UI if contract is fresh with 0 events
const INITIAL_DEMO_EVENTS: EventItemData[] = [
  {
    id: BigInt(101),
    organizer: "0xE15AF4D0AE06109bB2F373a5E0D8f43106224a20" as `0x${string}`,
    name: "BOT Chain Developers Summit 2026",
    description: "Deep dive into BOT Chain smart contracts, sub-second finality, and decentralized EVM architecture.",
    venue: "Main Hall, Innovation Park & Virtual Stream",
    eventDate: BigInt(Math.floor(Date.now() / 1000) + 86400 * 5),
    maxAttendees: BigInt(150),
    attendeeCount: BigInt(42),
    status: EventStatus.Open,
    createdAt: BigInt(Math.floor(Date.now() / 1000) - 86400 * 2),
  },
  {
    id: BigInt(102),
    organizer: "0xE15AF4D0AE06109bB2F373a5E0D8f43106224a20" as `0x${string}`,
    name: "Zero-Knowledge Workshop & Hack",
    description: "Hands-on engineering workshop exploring zk-SNARKs and lightweight zero-knowledge circuits.",
    venue: "Silicon Lounge B, Cyber Gateway",
    eventDate: BigInt(Math.floor(Date.now() / 1000) + 86400 * 12),
    maxAttendees: BigInt(50),
    attendeeCount: BigInt(50),
    status: EventStatus.Full,
    createdAt: BigInt(Math.floor(Date.now() / 1000) - 86400 * 4),
  },
  {
    id: BigInt(103),
    organizer: "0xE15AF4D0AE06109bB2F373a5E0D8f43106224a20" as `0x${string}`,
    name: "Global Web3 Founders Roundtable",
    description: "Exclusive quarterly gathering for Web3 protocol builders, founders, and angel syndicates.",
    venue: "The Penthouse, Tech Tower & Discord Stage",
    eventDate: BigInt(Math.floor(Date.now() / 1000) + 86400 * 20),
    maxAttendees: BigInt(75),
    attendeeCount: BigInt(18),
    status: EventStatus.Open,
    createdAt: BigInt(Math.floor(Date.now() / 1000) - 86400),
  },
];

export default function Home() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const contractAddress = (process.env.NEXT_PUBLIC_EVENTLY_ADDRESS as `0x${string}`) || DEFAULT_CONTRACT_ADDRESS;
  const isContractConfigured = contractAddress && contractAddress !== "0x0000000000000000000000000000000000000000";

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<"explore" | "create" | "my-events" | "my-registrations">("explore");

  // Local state for UI feedback
  const [txState, setTxState] = useState<TxState>({ type: "idle" });
  const [isRegistering, setIsRegistering] = useState(false);
  const [registeringId, setRegisteringId] = useState<bigint | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [actionEventId, setActionEventId] = useState<bigint | null>(null);

  // Wagmi Contract Interactions
  const { writeContractAsync } = useWriteContract();

  // Read all events from contract
  const {
    data: contractAllEvents,
    refetch: refetchAllEvents,
    isLoading: isLoadingAll,
  } = useReadContract({
    address: contractAddress,
    abi: EVENTLY_ABI,
    functionName: "getAllEvents",
    query: {
      enabled: Boolean(isContractConfigured),
    },
  });

  // Read user registered events
  const {
    data: contractMyRegistrations,
    refetch: refetchMyRegistrations,
  } = useReadContract({
    address: contractAddress,
    abi: EVENTLY_ABI,
    functionName: "getMyRegistrations",
    account: address,
    query: {
      enabled: Boolean(isContractConfigured && address),
    },
  });

  // Read events organized by user
  const {
    data: contractMyEvents,
    refetch: refetchMyEvents,
  } = useReadContract({
    address: contractAddress,
    abi: EVENTLY_ABI,
    functionName: "getMyEvents",
    account: address,
    query: {
      enabled: Boolean(isContractConfigured && address),
    },
  });

  // Local simulation list to ensure immediate responsiveness
  const [localEvents, setLocalEvents] = useState<EventItemData[]>([]);
  const [localRegisteredIds, setLocalRegisteredIds] = useState<Set<number>>(new Set());

  // Merge on-chain data with local fallback
  const displayEvents: EventItemData[] = useMemo(() => {
    if (contractAllEvents && Array.isArray(contractAllEvents) && contractAllEvents.length > 0) {
      return [...(contractAllEvents as EventItemData[])].reverse();
    }
    if (localEvents.length > 0) {
      return localEvents;
    }
    return INITIAL_DEMO_EVENTS;
  }, [contractAllEvents, localEvents]);

  // Registered Event IDs set
  const registeredEventIdsSet = useMemo(() => {
    const ids = new Set<number>(localRegisteredIds);
    if (contractMyRegistrations && Array.isArray(contractMyRegistrations)) {
      contractMyRegistrations.forEach((ev: any) => ids.add(Number(ev.id)));
    }
    return ids;
  }, [contractMyRegistrations, localRegisteredIds]);

  // Events created by user
  const userCreatedEvents: EventItemData[] = useMemo(() => {
    if (contractMyEvents && Array.isArray(contractMyEvents)) {
      return contractMyEvents as EventItemData[];
    }
    if (!address) return [];
    return displayEvents.filter(
      (ev) => ev.organizer.toLowerCase() === address.toLowerCase()
    );
  }, [contractMyEvents, displayEvents, address]);

  // Events registered by user
  const userRegisteredEvents: EventItemData[] = useMemo(() => {
    if (contractMyRegistrations && Array.isArray(contractMyRegistrations)) {
      return contractMyRegistrations as EventItemData[];
    }
    return displayEvents.filter((ev) => registeredEventIdsSet.has(Number(ev.id)));
  }, [contractMyRegistrations, displayEvents, registeredEventIdsSet]);

  // Dashboard metrics
  const totalEventsCount = displayEvents.length;
  const openEventsCount = displayEvents.filter((ev) => ev.status === EventStatus.Open).length;
  const myRegistrationsCount = userRegisteredEvents.length;
  const myCreatedEventsCount = userCreatedEvents.length;

  const refetchAll = async () => {
    if (isContractConfigured) {
      await Promise.all([refetchAllEvents(), refetchMyRegistrations(), refetchMyEvents()]);
    }
  };

  // Register for event handler
  const handleRegister = async (eventId: bigint) => {
    if (!isConnected || !address) {
      setTxState({
        type: "error",
        title: "Wallet Required",
        message: "Please connect your MetaMask wallet to register for this event.",
      });
      return;
    }

    try {
      setIsRegistering(true);
      setRegisteringId(eventId);
      setTxState({
        type: "pending",
        title: "Registering for Event",
        message: "Please confirm the transaction in MetaMask...",
      });

      if (isContractConfigured) {
        const txHash = await writeContractAsync({
          address: contractAddress,
          abi: EVENTLY_ABI,
          functionName: "registerForEvent",
          args: [eventId],
        });

        setTxState({
          type: "pending",
          title: "Confirming Registration",
          message: "Transaction broadcasted to BOT Chain.",
          txHash,
        });

        if (publicClient) {
          await publicClient.waitForTransactionReceipt({ hash: txHash });
        }

        setTxState({
          type: "success",
          title: "Registration Confirmed!",
          message: "You have successfully registered on-chain for this event.",
          txHash,
        });
        await refetchAll();
      } else {
        // Fallback simulated local confirmation if testing frontend directly
        await new Promise((r) => setTimeout(r, 1200));
        setLocalRegisteredIds((prev) => new Set([...prev, Number(eventId)]));
        setLocalEvents((prev) =>
          prev.map((ev) =>
            ev.id === eventId
              ? {
                  ...ev,
                  attendeeCount: ev.attendeeCount + BigInt(1),
                  status:
                    ev.attendeeCount + BigInt(1) >= ev.maxAttendees
                      ? EventStatus.Full
                      : ev.status,
                }
              : ev
          )
        );
        setTxState({
          type: "success",
          title: "Registration Confirmed!",
          message: "Registration recorded successfully.",
        });
      }
    } catch (err: any) {
      console.error(err);
      setTxState({
        type: "error",
        title: "Registration Error",
        message: err?.shortMessage || err?.message || "Failed to complete event registration.",
      });
    } finally {
      setIsRegistering(false);
      setRegisteringId(null);
    }
  };

  // Create event handler
  const handleCreateEvent = async (data: {
    name: string;
    description: string;
    venue: string;
    eventDate: bigint;
    maxAttendees: bigint;
  }) => {
    if (!isConnected || !address) {
      setTxState({
        type: "error",
        title: "Wallet Required",
        message: "Please connect your wallet to create an event.",
      });
      return;
    }

    try {
      setTxState({
        type: "pending",
        title: "Submitting Event",
        message: "Please sign the createEvent transaction in MetaMask...",
      });

      if (isContractConfigured) {
        const txHash = await writeContractAsync({
          address: contractAddress,
          abi: EVENTLY_ABI,
          functionName: "createEvent",
          args: [
            data.name,
            data.description,
            data.venue,
            data.eventDate,
            data.maxAttendees,
          ],
        });

        setTxState({
          type: "pending",
          title: "Mining Event Transaction",
          message: "Awaiting inclusion on BOT Chain block...",
          txHash,
        });

        let newEventId: bigint | undefined;
        if (publicClient) {
          const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
          // Parse EventCreated log if present
          if (receipt.logs && receipt.logs.length > 0) {
            newEventId = BigInt(receipt.logs[0].topics[1] || "1");
          }
        }

        setTxState({
          type: "success",
          title: "Event Published!",
          message: `"${data.name}" has been published to BOT Chain.`,
          txHash,
        });

        await refetchAll();
        return { txHash, eventId: newEventId };
      } else {
        // Local simulation fallback
        await new Promise((r) => setTimeout(r, 1200));
        const newId = BigInt(Date.now() % 100000);
        const newEvent: EventItemData = {
          id: newId,
          organizer: address,
          name: data.name,
          description: data.description,
          venue: data.venue,
          eventDate: data.eventDate,
          maxAttendees: data.maxAttendees,
          attendeeCount: BigInt(0),
          status: EventStatus.Open,
          createdAt: BigInt(Math.floor(Date.now() / 1000)),
        };

        setLocalEvents((prev) => [newEvent, ...(prev.length > 0 ? prev : INITIAL_DEMO_EVENTS)]);
        setTxState({
          type: "success",
          title: "Event Published!",
          message: `"${data.name}" is now live.`,
        });
        return { eventId: newId };
      }
    } catch (err: any) {
      console.error(err);
      setTxState({
        type: "error",
        title: "Event Creation Error",
        message: err?.shortMessage || err?.message || "Failed to broadcast transaction.",
      });
      throw err;
    }
  };

  // Cancel event handler
  const handleCancelEvent = async (eventId: bigint) => {
    try {
      setIsProcessingAction(true);
      setActionEventId(eventId);
      setTxState({
        type: "pending",
        title: "Cancelling Event",
        message: "Please confirm cancellation transaction in your wallet...",
      });

      if (isContractConfigured) {
        const txHash = await writeContractAsync({
          address: contractAddress,
          abi: EVENTLY_ABI,
          functionName: "cancelEvent",
          args: [eventId],
        });

        if (publicClient) {
          await publicClient.waitForTransactionReceipt({ hash: txHash });
        }

        setTxState({
          type: "success",
          title: "Event Cancelled",
          message: "Event status updated to Cancelled on-chain.",
          txHash,
        });
        await refetchAll();
      } else {
        setLocalEvents((prev) =>
          prev.map((ev) =>
            ev.id === eventId ? { ...ev, status: EventStatus.Cancelled } : ev
          )
        );
        setTxState({
          type: "success",
          title: "Event Cancelled",
          message: "Event has been marked cancelled.",
        });
      }
    } catch (err: any) {
      console.error(err);
      setTxState({
        type: "error",
        title: "Cancellation Failed",
        message: err?.shortMessage || err?.message || "Could not cancel event.",
      });
    } finally {
      setIsProcessingAction(false);
      setActionEventId(null);
    }
  };

  // Complete event handler
  const handleCompleteEvent = async (eventId: bigint) => {
    try {
      setIsProcessingAction(true);
      setActionEventId(eventId);
      setTxState({
        type: "pending",
        title: "Completing Event",
        message: "Please sign the transaction to complete this event...",
      });

      if (isContractConfigured) {
        const txHash = await writeContractAsync({
          address: contractAddress,
          abi: EVENTLY_ABI,
          functionName: "completeEvent",
          args: [eventId],
        });

        if (publicClient) {
          await publicClient.waitForTransactionReceipt({ hash: txHash });
        }

        setTxState({
          type: "success",
          title: "Event Completed",
          message: "Event marked as Completed on-chain.",
          txHash,
        });
        await refetchAll();
      } else {
        setLocalEvents((prev) =>
          prev.map((ev) =>
            ev.id === eventId ? { ...ev, status: EventStatus.Completed } : ev
          )
        );
        setTxState({
          type: "success",
          title: "Event Completed",
          message: "Event marked as Completed.",
        });
      }
    } catch (err: any) {
      console.error(err);
      setTxState({
        type: "error",
        title: "Action Failed",
        message: err?.shortMessage || err?.message || "Could not complete event.",
      });
    } finally {
      setIsProcessingAction(false);
      setActionEventId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-10 text-center sm:text-left sm:flex sm:items-end sm:justify-between border-b border-surface-border/60 pb-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-card border border-surface-border text-xs text-text-secondary">
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain"
                  className="w-4 h-4 rounded object-contain"
                />
                <span>Powered by BOT Chain Mainnet (Chain ID: 677)</span>
              </div>

              <a
                href="https://scan.botchain.ai/address/0xE15AF4D0AE06109bB2F373a5E0D8f43106224a20#code"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs font-mono font-medium hover:bg-emerald-900/40 transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Contract: 0xE15A...4a20 (Verified)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Simple, Free &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-green">On-Chain</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-text-secondary max-w-2xl">
              Host and attend web3 gatherings without ticket fees or sign-ups. Register with your MetaMask wallet on BOT Chain in one click.
            </p>
          </div>

          <div className="mt-6 sm:mt-0 flex items-center justify-center sm:justify-end gap-3">
            <button
              onClick={() => {
                setActiveTab("create");
                const el = document.getElementById("create");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-green hover:bg-brand-green-hover text-white text-xs sm:text-sm font-semibold shadow-lg shadow-emerald-950/40 active:scale-95 transition"
            >
              <Plus className="w-4 h-4" />
              Host an Event
            </button>
            <button
              onClick={() => {
                setActiveTab("explore");
                const el = document.getElementById("explore");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-card border border-surface-border hover:border-brand-purple/40 text-text-primary text-xs sm:text-sm font-medium transition"
            >
              <Compass className="w-4 h-4 text-brand-purple" />
              Explore All
            </button>
          </div>
        </div>

        {/* Dashboard Metric Overview */}
        <DashboardStats
          totalEvents={totalEventsCount}
          openEvents={openEventsCount}
          myRegistrationsCount={myRegistrationsCount}
          myCreatedEventsCount={myCreatedEventsCount}
          isConnected={isConnected}
        />

        {/* Navigation Tabs for Easy One-Page Switching */}
        <div className="flex items-center gap-2 mb-8 border-b border-surface-border overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("explore")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === "explore"
                ? "bg-surface-raised border border-brand-purple/40 text-white shadow-sm"
                : "text-text-secondary hover:text-white"
            }`}
          >
            <Compass className="w-4 h-4 text-brand-purple" />
            Explore Events
          </button>

          <button
            onClick={() => setActiveTab("create")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === "create"
                ? "bg-surface-raised border border-brand-green/40 text-white shadow-sm"
                : "text-text-secondary hover:text-white"
            }`}
          >
            <Plus className="w-4 h-4 text-brand-green" />
            Create Event
          </button>

          {isConnected && (
            <>
              <button
                onClick={() => setActiveTab("my-registrations")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  activeTab === "my-registrations"
                    ? "bg-surface-raised border border-indigo-500/40 text-white shadow-sm"
                    : "text-text-secondary hover:text-white"
                }`}
              >
                <BookmarkCheck className="w-4 h-4 text-indigo-400" />
                My Registrations ({myRegistrationsCount})
              </button>

              <button
                onClick={() => setActiveTab("my-events")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  activeTab === "my-events"
                    ? "bg-surface-raised border border-purple-500/40 text-white shadow-sm"
                    : "text-text-secondary hover:text-white"
                }`}
              >
                <Calendar className="w-4 h-4 text-purple-400" />
                My Created Events ({myCreatedEventsCount})
              </button>
            </>
          )}
        </div>

        {/* Section Contents Based on Tab or Full Page */}
        {activeTab === "explore" && (
          <ExploreEvents
            events={displayEvents}
            userAddress={address}
            userRegisteredEventIds={registeredEventIdsSet}
            onRegister={handleRegister}
            isRegistering={isRegistering}
            registeringId={registeringId}
            onOpenCreateModal={() => setActiveTab("create")}
          />
        )}

        {activeTab === "create" && (
          <CreateEventSection
            isConnected={isConnected}
            onCreateEvent={handleCreateEvent}
            isCreating={txState.type === "pending"}
          />
        )}

        {activeTab === "my-registrations" && (
          <MyRegistrationsSection
            events={userRegisteredEvents}
            isConnected={isConnected}
            onExploreClick={() => setActiveTab("explore")}
          />
        )}

        {activeTab === "my-events" && (
          <MyEventsSection
            events={userCreatedEvents}
            isConnected={isConnected}
            onCancelEvent={handleCancelEvent}
            onCompleteEvent={handleCompleteEvent}
            isProcessingAction={isProcessingAction}
            actionEventId={actionEventId}
            onScrollToCreate={() => setActiveTab("create")}
          />
        )}
      {/* BOT Chain Ecosystem Section */}
        <div className="mt-16 mb-4 rounded-3xl bg-gradient-to-br from-surface-card via-surface-card to-surface-raised border border-surface-border p-6 sm:p-8 lg:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain"
                  className="w-4 h-4 rounded object-contain"
                />
                <span>BOT Chain Ecosystem</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain"
                  className="w-8 h-8 rounded-lg object-contain bg-black/40 p-0.5 border border-emerald-500/30"
                />
                <span>Built natively for BOT Chain</span>
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Evently runs on BOT Chain (Chain ID: 677). Powered by sub-second finality, 150 Million BOT native supply, and zero-fee participant registration.
              </p>
              <div className="pt-1">
                <span className="text-xs text-text-muted font-mono">
                  Mainnet Contract:{" "}
                  <a
                    href="https://scan.botchain.ai/address/0xE15AF4D0AE06109bB2F373a5E0D8f43106224a20#code"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:underline font-semibold"
                  >
                    0xE15AF4D0AE06109bB2F373a5E0D8f43106224a20
                  </a>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://botchain.ai"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-surface-raised hover:bg-surface-border border border-surface-border text-white text-xs sm:text-sm font-semibold transition group shadow-sm"
              >
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain"
                  className="w-5 h-5 rounded object-contain group-hover:scale-110 transition-transform"
                />
                <span>BOT Chain Website</span>
                <ExternalLink className="w-3.5 h-3.5 text-text-muted" />
              </a>

              <a
                href="https://scan.botchain.ai"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-xs sm:text-sm font-semibold transition shadow-md shadow-purple-950/40 group"
              >
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain"
                  className="w-5 h-5 rounded object-contain group-hover:scale-110 transition-transform"
                />
                <span>BOT Chain Explorer</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://scan.botchain.ai/address/0xE15AF4D0AE06109bB2F373a5E0D8f43106224a20#code"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-card hover:bg-surface-raised border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Contract</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-border bg-surface/60 py-10 mt-16 text-xs text-text-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-surface-border/60">
            {/* Logo and info */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-purple to-brand-green flex items-center justify-center text-white font-bold font-mono">
                E
              </div>
              <div>
                <span className="font-mono font-bold text-white text-base">Evently</span>
                <p className="text-text-secondary text-xs">On-Chain Event Registration Protocol</p>
              </div>
            </div>

            {/* Required Ecosystem Links with BOT Chain Logo/Name */}
            <div className="flex flex-wrap items-center justify-center gap-5 text-xs">
              <div className="flex items-center gap-2 text-text-primary font-medium">
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain"
                  className="w-4 h-4 rounded object-contain"
                />
                <span>BOT Chain (Chain ID: 677)</span>
              </div>
              <span className="text-surface-border hidden sm:inline">|</span>
              <a
                href="https://botchain.ai"
                target="_blank"
                rel="noreferrer"
                className="text-text-secondary hover:text-white flex items-center gap-2 transition font-medium group"
              >
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain"
                  className="w-4 h-4 rounded object-contain group-hover:scale-110 transition-transform"
                />
                <span>BOT Chain Website: https://botchain.ai</span>
              </a>
              <span className="text-surface-border hidden sm:inline">|</span>
              <a
                href="https://scan.botchain.ai"
                target="_blank"
                rel="noreferrer"
                className="text-text-secondary hover:text-white flex items-center gap-2 transition font-medium group"
              >
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain"
                  className="w-4 h-4 rounded object-contain group-hover:scale-110 transition-transform"
                />
                <span>BOT Chain Explorer: https://scan.botchain.ai</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-text-muted text-[11px]">
            <p>© 2026 Evently. Built for the BOT Chain community.</p>
            <div className="flex items-center gap-4">
              <span>Native Token: BOT (150M Supply)</span>
              <span>•</span>
              <a
                href="https://scan.botchain.ai/address/0xE15AF4D0AE06109bB2F373a5E0D8f43106224a20#code"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:underline font-mono"
              >
                Mainnet Contract: 0xE15AF4D0AE06109bB2F373a5E0D8f43106224a20 (Verified)
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Transaction Status Notification */}
      <TxNotification
        txState={txState}
        onClose={() => setTxState({ type: "idle" })}
      />
    </div>
  );
}
