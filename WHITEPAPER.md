# Evently: Whitepaper & Project Deck

**Decentralized, Fee-Free Event Management & Registration on Botchain**  
*Version 1.0 — November 2026*  

**Project Links:**
- **Repository:** [https://github.com/liljhnxn/evently](https://github.com/liljhnxn/evently)
- **Deployed Contract (Botchain Testnet):** [`0xbDcBdb48271D430f3051bABA75934fB928A61171`](https://scan.bohr.life/address/0xbDcBdb48271D430f3051bABA75934fB928A61171#code)
- **Network:** Botchain Testnet (Chain ID: `968`)
- **Block Explorer:** [https://scan.bohr.life](https://scan.bohr.life)

---

## 1. Executive Summary

**Evently** is an on-chain event coordination protocol and decentralized application built natively for **Botchain**. Designed for Web3 communities, developer meetups, conferences, and workshops, Evently addresses the critical pitfalls of legacy event ticketing: high platform fees, invasive personal data collection, centralized censorship, and opaque attendee management.

By leveraging smart contract primitives on Botchain, Evently guarantees cryptographic transparency, immutable participant caps, and instant one-click wallet RSVPs without charging platform or transaction fees to attendees.

---

## 2. Problem Statement

Modern event management platforms (Eventbrite, Luma, Meetup) present major friction points for decentralized communities:

1. **Exorbitant Intermediary Fees:** Legacy ticketing providers levy platform fees ranging from 5% to 15% even on free/community-supported events.
2. **Privacy Intrusion & Data Extraction:** Traditional platforms mandate email addresses, phone numbers, tracking pixels, and credit cards, creating central targets for data breaches.
3. **Ghost Attendees & Opaque Capacity:** Organizers struggle with inaccurate attendance headcounts and lack transparent, verifiable capacity thresholds.
4. **Platform Lock-in & Censorship:** Centralized gatekeepers can arbitrarily de-platform events, hold back RSVPs, or restrict organizer access to attendee graphs.

---

## 3. The Solution: Evently

Evently replaces centralized databases with trustless, gas-efficient smart contracts on Botchain:

- **Zero-Fee Protocol:** Free event creation and free attendee registration with no platform surcharges.
- **Privacy-Preserving On-Chain RSVPs:** Users RSVP exclusively via their public wallet address (`MetaMask` or any EIP-1193 wallet). No personal identifiers are collected.
- **Automated Capacity Enforcement:** Hard attendance limits are hardcoded in the smart contract. Once capacity is reached, the status programmatically transitions to `Full`, disallowing unauthorized over-registration.
- **Organizer Sovereignty:** Organizers retain full administrative control over their events (cancellation, status updates, completion) validated directly through `msg.sender` cryptography.

---

## 4. Product Highlights & User Experience

```
+-----------------------------------------------------------------------+
|                               EVENTLY                                 |
|                     Find your next experience.                        |
+-----------------------------------------------------------------------+
|  [Total Events: 12]  [Open: 8]  [My Passes: 2]  [Created by Me: 1]    |
+-----------------------------------------------------------------------+
|  EXPLORE EVENTS            CREATE EVENT             MY REGISTRATIONS  |
|  - Real-time Slot Gauge    - Future Timestamp Check - Confirmed Pass  |
|  - Search & Status Filters - Auto ID Assignment     - Host Proof      |
|  - 1-Click Free RSVP       - Explorer Tx Proof      - Cancellation    |
+-----------------------------------------------------------------------+
```

### For Attendees:
- **One-Click RSVP:** Browse active events without connecting a wallet; connect MetaMask only when ready to register.
- **Tamper-Proof Passes:** Registration confirmed by on-chain receipt visible directly on BohrScan.
- **Transparent Slots:** Always see real-time available capacity and status badges (`Open`, `Full`, `Cancelled`, `Completed`).

### For Organizers:
- **Instant Deployment:** Create public events with name, description, venue/link, future date, and maximum attendee limits in seconds.
- **Anti-Duplication Security:** Built-in duplicate registration protection prevents wallet sybils or double RSVPs.
- **Lifecycle Management:** Dedicated organizer dashboard to monitor attendee counts, cancel postponed sessions, or mark events completed.

---

## 5. Technical Architecture

### 5.1 Technology Stack
- **Smart Contracts:** Solidity `^0.8.24`, compiled with Hardhat optimizer (`200` runs).
- **Frontend Framework:** Next.js 14 (App Router) + TypeScript.
- **Web3 Layer:** wagmi v2 + viem client bindings.
- **Styling & Design System:** Tailwind CSS with a charcoal aesthetic (`#0c0e12`), glowing purple (`#9d4edd`) and emerald green (`#10b981`) accents.

### 5.2 Smart Contract Architecture (`contracts/Evently.sol`)
```solidity
enum EventStatus { Open, Full, Cancelled, Completed }

struct EventItem {
    uint256 id;
    address organizer;
    string name;
    string description;
    string venue;
    uint256 eventDate;
    uint256 maxAttendees;
    uint256 attendeeCount;
    EventStatus status;
    uint256 createdAt;
}
```

### 5.3 Core Methods & Gas Optimization
- **Custom Errors:** Replaces expensive error strings with custom EVM errors (`InvalidName`, `InvalidDate`, `InvalidCapacity`, `EventIsFull`, `AlreadyRegistered`, `NotOrganizer`).
- **Sequential Indexing:** Sequential storage counter `_eventIdCounter` provides O(1) state lookups and event iteration.
- **Dual Mappings:** Fast retrieval for `hasRegistered(eventId, user)` and organizer event queries.

---

## 6. Security, Testing & Auditability

Evently underwent comprehensive unit testing across Hardhat's in-memory EVM:

| Test Category | Description | Status |
|---|---|---|
| **Event Creation** | Valid creation, future date validation, positive attendee check, empty name/venue rejection | Passed ✅ |
| **Registration Flow** | Successful RSVP, duplicate RSVP rejection, status transition to `Full` at capacity | Passed ✅ |
| **Access Control** | Organizer-only cancellation, organizer-only completion, duplicate status transition rejection | Passed ✅ |
| **State Retrieval** | Querying all events, organizer created lists, and user registration arrays | Passed ✅ |

**Test Result:** 15/15 passing tests (`npm run test`).

---

## 7. Ecosystem Value for Botchain

1. **Transaction Velocity:** Drives continuous on-chain interactions on Botchain Testnet and Mainnet through RSVPs, event launches, and check-ins.
2. **Community Onboarding:** Low-barrier, fee-free entry point for Web3 newcomers testing Botchain capabilities and wallet integrations.
3. **Native Utility:** Provides Botchain protocols and developer teams with an un-censorable native tool to coordinate hackathons, developer calls, and governance summits.

---

## 8. Strategic Roadmap

- **Phase 1 (Completed):** Smart contract deployment & source verification on Botchain Testnet; Next.js dApp launch; full RSVP & organizer flow.
- **Phase 2 (Current):** Ecosystem partner onboarding, community pilot testing, and co-marketing rollout with Botchain.
- **Phase 3:** Non-transferable On-Chain Attendance Badges (Soulbound Tokens / POAPs) for verified attendees.
- **Phase 4:** Decentralized file storage integration (IPFS/Arweave) for high-resolution event banners and agendas.
- **Phase 5:** Mainnet deployment on Botchain.

---

## 9. Contact & Submission Verification

- **Lead Developer:** liljhnxn
- **GitHub Repository:** [https://github.com/liljhnxn/evently](https://github.com/liljhnxn/evently)
- **Verified Contract:** `0xbDcBdb48271D430f3051bABA75934fB928A61171`
- **Explorer Verification:** [https://scan.bohr.life/address/0xbDcBdb48271D430f3051bABA75934fB928A61171#code](https://scan.bohr.life/address/0xbDcBdb48271D430f3051bABA75934fB928A61171#code)
