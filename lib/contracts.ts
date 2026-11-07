export const EVENTLY_ABI = [
  {
    inputs: [],
    name: "AlreadyRegistered",
    type: "error",
  },
  {
    inputs: [],
    name: "EventIsFull",
    type: "error",
  },
  {
    inputs: [],
    name: "EventNotFound",
    type: "error",
  },
  {
    inputs: [],
    name: "EventNotOpen",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidCapacity",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidDate",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidName",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidStatusTransition",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidVenue",
    type: "error",
  },
  {
    inputs: [],
    name: "NotOrganizer",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "eventId", type: "uint256" },
      { indexed: true, internalType: "address", name: "attendee", type: "address" },
      { indexed: false, internalType: "uint256", name: "attendeeCount", type: "uint256" },
    ],
    name: "AttendeeRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "eventId", type: "uint256" },
      { indexed: true, internalType: "address", name: "organizer", type: "address" },
    ],
    name: "EventCancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "eventId", type: "uint256" },
      { indexed: true, internalType: "address", name: "organizer", type: "address" },
    ],
    name: "EventCompleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "eventId", type: "uint256" },
      { indexed: true, internalType: "address", name: "organizer", type: "address" },
      { indexed: false, internalType: "string", name: "name", type: "string" },
      { indexed: false, internalType: "string", name: "venue", type: "string" },
      { indexed: false, internalType: "uint256", name: "eventDate", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "maxAttendees", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "createdAt", type: "uint256" },
    ],
    name: "EventCreated",
    type: "event",
  },
  {
    inputs: [{ internalType: "uint256", name: "eventId", type: "uint256" }],
    name: "cancelEvent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "eventId", type: "uint256" }],
    name: "completeEvent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "description", type: "string" },
      { internalType: "string", name: "venue", type: "string" },
      { internalType: "uint256", name: "eventDate", type: "uint256" },
      { internalType: "uint256", name: "maxAttendees", type: "uint256" },
    ],
    name: "createEvent",
    outputs: [{ internalType: "uint256", name: "eventId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllEvents",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "address", name: "organizer", type: "address" },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "string", name: "venue", type: "string" },
          { internalType: "uint256", name: "eventDate", type: "uint256" },
          { internalType: "uint256", name: "maxAttendees", type: "uint256" },
          { internalType: "uint256", name: "attendeeCount", type: "uint256" },
          { internalType: "uint8", name: "status", type: "uint8" },
          { internalType: "uint256", name: "createdAt", type: "uint256" },
        ],
        internalType: "struct Evently.EventItem[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "eventId", type: "uint256" }],
    name: "getEvent",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "address", name: "organizer", type: "address" },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "string", name: "venue", type: "string" },
          { internalType: "uint256", name: "eventDate", type: "uint256" },
          { internalType: "uint256", name: "maxAttendees", type: "uint256" },
          { internalType: "uint256", name: "attendeeCount", type: "uint256" },
          { internalType: "uint8", name: "status", type: "uint8" },
          { internalType: "uint256", name: "createdAt", type: "uint256" },
        ],
        internalType: "struct Evently.EventItem",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMyEvents",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "address", name: "organizer", type: "address" },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "string", name: "venue", type: "string" },
          { internalType: "uint256", name: "eventDate", type: "uint256" },
          { internalType: "uint256", name: "maxAttendees", type: "uint256" },
          { internalType: "uint256", name: "attendeeCount", type: "uint256" },
          { internalType: "uint8", name: "status", type: "uint8" },
          { internalType: "uint256", name: "createdAt", type: "uint256" },
        ],
        internalType: "struct Evently.EventItem[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMyRegistrations",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "address", name: "organizer", type: "address" },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "string", name: "venue", type: "string" },
          { internalType: "uint256", name: "eventDate", type: "uint256" },
          { internalType: "uint256", name: "maxAttendees", type: "uint256" },
          { internalType: "uint256", name: "attendeeCount", type: "uint256" },
          { internalType: "uint8", name: "status", type: "uint8" },
          { internalType: "uint256", name: "createdAt", type: "uint256" },
        ],
        internalType: "struct Evently.EventItem[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalEvents",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "eventId", type: "uint256" },
      { internalType: "address", name: "user", type: "address" },
    ],
    name: "hasRegistered",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "eventId", type: "uint256" }],
    name: "registerForEvent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export enum EventStatus {
  Open = 0,
  Full = 1,
  Cancelled = 2,
  Completed = 3,
}

export interface EventItemData {
  id: bigint;
  organizer: `0x${string}`;
  name: string;
  description: string;
  venue: string;
  eventDate: bigint;
  maxAttendees: bigint;
  attendeeCount: bigint;
  status: EventStatus;
  createdAt: bigint;
}

export const DEFAULT_CONTRACT_ADDRESS: `0x${string}` =
  (process.env.NEXT_PUBLIC_EVENTLY_ADDRESS as `0x${string}`) ||
  "0xE15AF4D0AE06109bB2F373a5E0D8f43106224a20";

