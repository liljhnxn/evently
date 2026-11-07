# Evently — On-Chain Web3 Event Registration Application

> **"Find your next experience."**  
> A lightweight, modern, and beginner-friendly decentralized event registration platform powered by **BOT Chain**.

---

## 🌐 BOT Chain Ecosystem

- **BOT Chain Website:** [https://botchain.ai](https://botchain.ai)
- **BOT Chain Explorer:** [https://scan.botchain.ai](https://scan.botchain.ai)
- **Verified Smart Contract:** [`0xE15AF4D0AE06109bB2F373a5E0D8f43106224a20`](https://scan.botchain.ai/address/0xE15AF4D0AE06109bB2F373a5E0D8f43106224a20#code)

---

## 🌟 Overview

**Evently** allows event organizers to create and manage gatherings on-chain with attendance caps and full transparency. Attendees can browse upcoming conferences, workshops, meetups, and seminars, and register for free with their Web3 wallets in a single click—no centralized intermediaries, no ticket fees, and zero hidden data harvesting.

---

## ⚡ Tech Stack

- **Frontend Framework**: [Next.js](https://nextjs.org/) (App Router, React 18)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Custom charcoal theme with muted purple `#9d4edd` & emerald green `#10b981` accents)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Smart Contracts**: [Solidity](https://soliditylang.org/) `^0.8.24`
- **Development & Testing Suite**: [Hardhat](https://hardhat.org/)
- **Web3 Libraries**: [wagmi v2](https://wagmi.sh/), [viem](https://viem.sh/)
- **Supported Wallet**: [MetaMask](https://metamask.io/) (and EIP-1193 injected providers)

---

## 🌐 Blockchain Configuration (BOT Chain)

| Parameter | Value |
|---|---|
| **Network Name** | BOT Chain |
| **Chain ID** | `677` |
| **RPC Endpoint** | `https://rpc.botchain.ai` |
| **Block Explorer** | [https://scan.botchain.ai](https://scan.botchain.ai) |
| **Official Website** | [https://botchain.ai](https://botchain.ai) |
| **Native Token** | BOT |
| **Total Supply** | 150 Million BOT |
| **Deployed & Verified Contract** | [`0xE15AF4D0AE06109bB2F373a5E0D8f43106224a20`](https://scan.botchain.ai/address/0xE15AF4D0AE06109bB2F373a5E0D8f43106224a20#code) |

---

## 📜 Smart Contract Architecture (`contracts/Evently.sol`)

The `Evently.sol` contract is designed to be gas-efficient, secure, and intuitive:

### Event Data Model
```solidity
struct EventItem {
    uint256 id;
    address organizer;
    string name;
    string description;
    string venue;
    uint256 eventDate;
    uint256 maxAttendees;
    uint256 attendeeCount;
    EventStatus status;      // Open (0), Full (1), Cancelled (2), Completed (3)
    uint256 createdAt;
}
```

### Core Functions
- `createEvent(name, description, venue, eventDate, maxAttendees)`: Validates future timestamp, non-empty parameters, and positive attendee limits. Assigns a sequential ID and sets status to `Open`.
- `registerForEvent(eventId)`: Registers the caller for an open event. Automatically changes status to `Full` once maximum capacity is hit.
- `cancelEvent(eventId)`: Restricted to the event organizer; cancels an active event.
- `completeEvent(eventId)`: Restricted to the event organizer; marks past events as concluded.
- `getEvent(eventId)`: Returns complete details of a specific event.
- `getAllEvents()`: Returns an array of all registered events.
- `getMyEvents()`: Returns all events organized by the connected wallet.
- `getMyRegistrations()`: Returns all events the connected wallet has claimed a pass for.
- `hasRegistered(eventId, user)`: Checks whether a specific wallet is already registered.

### Custom Errors
Gas-optimized custom errors are used throughout:
- `InvalidName()`
- `InvalidVenue()`
- `InvalidDate()`
- `InvalidCapacity()`
- `EventNotFound()`
- `AlreadyRegistered()`
- `EventNotOpen()`
- `EventIsFull()`
- `NotOrganizer()`
- `InvalidStatusTransition()`

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v20/v25)
- **MetaMask** browser extension installed

### 2. Installation
Clone the repository and install all dependencies:
```bash
git clone https://github.com/liljhnxn/evently.git
cd Evently
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Populate `.env` with the configuration:
```env
# Blockchain Configuration - BOT Chain
BOTCHAIN_RPC_URL=https://rpc.botchain.ai
BOTCHAIN_MAINNET_RPC_URL=https://rpc.botchain.ai
PRIVATE_KEY=your_private_key_without_0x

# Frontend Configuration
NEXT_PUBLIC_EVENTLY_ADDRESS=0xE15AF4D0AE06109bB2F373a5E0D8f43106224a20
NEXT_PUBLIC_CHAIN_ID=677
```

---

## 🧪 Smart Contract Tests

All unit tests are located in `test/Evently.test.ts`. They comprehensively test:
1. Valid event creation
2. Rejection of empty event names
3. Rejection of empty venues
4. Rejection of past event timestamps
5. Rejection of zero attendee capacity
6. Single and multiple registrations
7. Prevention of duplicate registrations
8. Auto-transition to `Full` status and rejecting registrations past capacity
9. Organizer event cancellation and rejection of non-organizer cancellation
10. Registration rejection on cancelled events
11. Event completion by organizer
12. Status finality protection (cannot cancel or complete twice)
13. Array retrieval for all events, organizer events, and user registrations

Run tests via Hardhat:
```bash
npm run test
```

---

## 🚢 Smart Contract Deployment & Verification

Deploy to BOT Chain with minimal gas:
```bash
npm run deploy:mainnet
```

Verify contract source code on BotchainScan:
```bash
npx hardhat verify --network botchainMainnet <CONTRACT_ADDRESS>
```

---

## 💻 Running the Frontend

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```

---

## 🔒 Security and Privacy
- **Zero Custody**: Evently does not hold funds; all event passes are completely free.
- **On-Chain Access Control**: Only the original event organizer can cancel or complete their respective events.
- **Privacy-Preserving**: No emails, passwords, or personal credentials are required—registration is tied solely to your public wallet address.

---

## 🔗 Official Ecosystem Links
- **BOT Chain Website:** [https://botchain.ai](https://botchain.ai)
- **BOT Chain Explorer:** [https://scan.botchain.ai](https://scan.botchain.ai)

---

## 📄 License
MIT
