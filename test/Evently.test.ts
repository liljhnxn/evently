import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("Evently Smart Contract", function () {
  let evently: any;
  let owner: any;
  let user1: any;
  let user2: any;
  let user3: any;

  beforeEach(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();
    const EventlyFactory = await ethers.getContractFactory("Evently");
    evently = await EventlyFactory.deploy();
    await evently.waitForDeployment();
  });

  describe("Event Creation", function () {
    it("should create an event successfully with valid parameters", async function () {
      const currentTime = await time.latest();
      const futureDate = currentTime + 86400; // +1 day
      const tx = await evently.createEvent(
        "Web3 Builders Meetup",
        "A meetup for blockchain and decentralized tech enthusiasts.",
        "Silicon Hub, Lagos",
        futureDate,
        50
      );

      await expect(tx)
        .to.emit(evently, "EventCreated")
        .withArgs(1, owner.address, "Web3 Builders Meetup", "Silicon Hub, Lagos", futureDate, 50, await time.latest());

      const eventItem = await evently.getFunction("getEvent")(1);
      expect(eventItem.id).to.equal(1n);
      expect(eventItem.organizer).to.equal(owner.address);
      expect(eventItem.name).to.equal("Web3 Builders Meetup");
      expect(eventItem.description).to.equal("A meetup for blockchain and decentralized tech enthusiasts.");
      expect(eventItem.venue).to.equal("Silicon Hub, Lagos");
      expect(eventItem.eventDate).to.equal(BigInt(futureDate));
      expect(eventItem.maxAttendees).to.equal(50n);
      expect(eventItem.attendeeCount).to.equal(0n);
      expect(eventItem.status).to.equal(0); // EventStatus.Open
    });

    it("should reject creation with empty event name", async function () {
      const currentTime = await time.latest();
      const futureDate = currentTime + 86400;

      await expect(
        evently.createEvent("", "Desc", "Venue", futureDate, 10)
      ).to.be.revertedWithCustomError(evently, "InvalidName");
    });

    it("should reject creation with empty venue", async function () {
      const currentTime = await time.latest();
      const futureDate = currentTime + 86400;

      await expect(
        evently.createEvent("Tech Conference", "Desc", "", futureDate, 10)
      ).to.be.revertedWithCustomError(evently, "InvalidVenue");
    });

    it("should reject creation with past or current event date", async function () {
      const currentTime = await time.latest();
      const pastDate = currentTime - 100;

      await expect(
        evently.createEvent("Tech Conference", "Desc", "Online", pastDate, 10)
      ).to.be.revertedWithCustomError(evently, "InvalidDate");
    });

    it("should reject creation with zero attendee capacity", async function () {
      const currentTime = await time.latest();
      const futureDate = currentTime + 86400;

      await expect(
        evently.createEvent("Tech Conference", "Desc", "Online", futureDate, 0)
      ).to.be.revertedWithCustomError(evently, "InvalidCapacity");
    });
  });

  describe("Event Registration", function () {
    let eventId: bigint;
    let futureDate: number;

    beforeEach(async function () {
      const currentTime = await time.latest();
      futureDate = currentTime + 86400;
      await evently.createEvent("Web3 Hackathon", "Code and build", "Virtual Room", futureDate, 2);
      eventId = 1n;
    });

    it("should allow a user to register for an open event", async function () {
      await expect(evently.connect(user1).registerForEvent(eventId))
        .to.emit(evently, "AttendeeRegistered")
        .withArgs(eventId, user1.address, 1n);

      const isRegistered = await evently.hasRegistered(eventId, user1.address);
      expect(isRegistered).to.be.true;

      const eventItem = await evently.getFunction("getEvent")(eventId);
      expect(eventItem.attendeeCount).to.equal(1n);
      expect(eventItem.status).to.equal(0); // Open
    });

    it("should prevent duplicate registration by the same user", async function () {
      await evently.connect(user1).registerForEvent(eventId);

      await expect(
        evently.connect(user1).registerForEvent(eventId)
      ).to.be.revertedWithCustomError(evently, "AlreadyRegistered");
    });

    it("should update status to Full when capacity is reached and reject further registrations", async function () {
      await evently.connect(user1).registerForEvent(eventId);
      await evently.connect(user2).registerForEvent(eventId);

      const eventItem = await evently.getFunction("getEvent")(eventId);
      expect(eventItem.attendeeCount).to.equal(2n);
      expect(eventItem.status).to.equal(1); // Full

      await expect(
        evently.connect(user3).registerForEvent(eventId)
      ).to.be.revertedWithCustomError(evently, "EventIsFull");
    });

    it("should revert if event does not exist", async function () {
      await expect(
        evently.connect(user1).registerForEvent(999)
      ).to.be.revertedWithCustomError(evently, "EventNotFound");
    });
  });

  describe("Event Cancellation and Completion", function () {
    let eventId: bigint;
    let futureDate: number;

    beforeEach(async function () {
      const currentTime = await time.latest();
      futureDate = currentTime + 86400;
      await evently.connect(owner).createEvent("Networking Summit", "Connect", "Convention Center", futureDate, 100);
      eventId = 1n;
    });

    it("should allow organizer to cancel an event", async function () {
      await expect(evently.connect(owner).cancelEvent(eventId))
        .to.emit(evently, "EventCancelled")
        .withArgs(eventId, owner.address);

      const eventItem = await evently.getFunction("getEvent")(eventId);
      expect(eventItem.status).to.equal(2); // Cancelled
    });

    it("should prevent non-organizer from cancelling the event", async function () {
      await expect(
        evently.connect(user1).cancelEvent(eventId)
      ).to.be.revertedWithCustomError(evently, "NotOrganizer");
    });

    it("should reject registration for cancelled events", async function () {
      await evently.connect(owner).cancelEvent(eventId);

      await expect(
        evently.connect(user1).registerForEvent(eventId)
      ).to.be.revertedWithCustomError(evently, "EventNotOpen");
    });

    it("should allow organizer to mark event as completed", async function () {
      await expect(evently.connect(owner).completeEvent(eventId))
        .to.emit(evently, "EventCompleted")
        .withArgs(eventId, owner.address);

      const eventItem = await evently.getFunction("getEvent")(eventId);
      expect(eventItem.status).to.equal(3); // Completed
    });

    it("should reject duplicate cancellation or completion once finalised", async function () {
      await evently.connect(owner).cancelEvent(eventId);

      await expect(
        evently.connect(owner).cancelEvent(eventId)
      ).to.be.revertedWithCustomError(evently, "InvalidStatusTransition");

      await expect(
        evently.connect(owner).completeEvent(eventId)
      ).to.be.revertedWithCustomError(evently, "InvalidStatusTransition");
    });
  });

  describe("Retrieval and Queries", function () {
    it("should retrieve all events, organizer events, and user registrations correctly", async function () {
      const currentTime = await time.latest();
      await evently.connect(owner).createEvent("Event 1", "Desc 1", "Venue 1", currentTime + 1000, 10);
      await evently.connect(user1).createEvent("Event 2", "Desc 2", "Venue 2", currentTime + 2000, 20);

      const all = await evently.getAllEvents();
      expect(all.length).to.equal(2);
      expect(all[0].name).to.equal("Event 1");
      expect(all[1].name).to.equal("Event 2");

      const ownerEvents = await evently.connect(owner).getMyEvents();
      expect(ownerEvents.length).to.equal(1);
      expect(ownerEvents[0].name).to.equal("Event 1");

      const user1Events = await evently.connect(user1).getMyEvents();
      expect(user1Events.length).to.equal(1);
      expect(user1Events[0].name).to.equal("Event 2");

      // Register user2 for Event 1
      await evently.connect(user2).registerForEvent(1);
      const user2Regs = await evently.connect(user2).getMyRegistrations();
      expect(user2Regs.length).to.equal(1);
      expect(user2Regs[0].id).to.equal(1n);
    });
  });
});
