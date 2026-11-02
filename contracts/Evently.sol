// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title Evently
 * @notice Simple, lightweight and gas-efficient on-chain event registration contract.
 */
contract Evently {
    enum EventStatus {
        Open,
        Full,
        Cancelled,
        Completed
    }

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

    // Custom errors for gas efficiency
    error InvalidName();
    error InvalidVenue();
    error InvalidDate();
    error InvalidCapacity();
    error EventNotFound();
    error AlreadyRegistered();
    error EventNotOpen();
    error EventIsFull();
    error NotOrganizer();
    error InvalidStatusTransition();

    // Event counter
    uint256 private _eventIdCounter;

    // Storage mappings
    mapping(uint256 => EventItem) private _events;
    mapping(uint256 => mapping(address => bool)) private _registrations;
    mapping(address => uint256[]) private _organizerEvents;
    mapping(address => uint256[]) private _userRegistrations;

    // Events
    event EventCreated(
        uint256 indexed eventId,
        address indexed organizer,
        string name,
        string venue,
        uint256 eventDate,
        uint256 maxAttendees,
        uint256 createdAt
    );

    event AttendeeRegistered(
        uint256 indexed eventId,
        address indexed attendee,
        uint256 attendeeCount
    );

    event EventCancelled(uint256 indexed eventId, address indexed organizer);
    event EventCompleted(uint256 indexed eventId, address indexed organizer);

    /**
     * @notice Creates a new event with specified parameters.
     * @param name The title of the event
     * @param description Brief description of what the event is about
     * @param venue Location or virtual link for the event
     * @param eventDate Unix timestamp (must be in the future)
     * @param maxAttendees Maximum number of participants allowed (must be > 0)
     * @return eventId The generated unique ID of the newly created event
     */
    function createEvent(
        string calldata name,
        string calldata description,
        string calldata venue,
        uint256 eventDate,
        uint256 maxAttendees
    ) external returns (uint256 eventId) {
        if (bytes(name).length == 0) revert InvalidName();
        if (bytes(venue).length == 0) revert InvalidVenue();
        if (eventDate <= block.timestamp) revert InvalidDate();
        if (maxAttendees == 0) revert InvalidCapacity();

        _eventIdCounter++;
        eventId = _eventIdCounter;

        _events[eventId] = EventItem({
            id: eventId,
            organizer: msg.sender,
            name: name,
            description: description,
            venue: venue,
            eventDate: eventDate,
            maxAttendees: maxAttendees,
            attendeeCount: 0,
            status: EventStatus.Open,
            createdAt: block.timestamp
        });

        _organizerEvents[msg.sender].push(eventId);

        emit EventCreated(
            eventId,
            msg.sender,
            name,
            venue,
            eventDate,
            maxAttendees,
            block.timestamp
        );
    }

    /**
     * @notice Registers the caller for an open event.
     * @param eventId The unique ID of the event
     */
    function registerForEvent(uint256 eventId) external {
        if (eventId == 0 || eventId > _eventIdCounter) revert EventNotFound();

        EventItem storage item = _events[eventId];

        if (item.status == EventStatus.Cancelled || item.status == EventStatus.Completed) {
            revert EventNotOpen();
        }

        if (item.status == EventStatus.Full || item.attendeeCount >= item.maxAttendees) {
            revert EventIsFull();
        }

        if (_registrations[eventId][msg.sender]) {
            revert AlreadyRegistered();
        }

        _registrations[eventId][msg.sender] = true;
        _userRegistrations[msg.sender].push(eventId);
        item.attendeeCount++;

        if (item.attendeeCount == item.maxAttendees) {
            item.status = EventStatus.Full;
        }

        emit AttendeeRegistered(eventId, msg.sender, item.attendeeCount);
    }

    /**
     * @notice Allows an organizer to cancel their event.
     * @param eventId The unique ID of the event
     */
    function cancelEvent(uint256 eventId) external {
        if (eventId == 0 || eventId > _eventIdCounter) revert EventNotFound();

        EventItem storage item = _events[eventId];

        if (item.organizer != msg.sender) revert NotOrganizer();
        if (item.status == EventStatus.Cancelled || item.status == EventStatus.Completed) {
            revert InvalidStatusTransition();
        }

        item.status = EventStatus.Cancelled;
        emit EventCancelled(eventId, msg.sender);
    }

    /**
     * @notice Allows an organizer to mark their event as completed.
     * @param eventId The unique ID of the event
     */
    function completeEvent(uint256 eventId) external {
        if (eventId == 0 || eventId > _eventIdCounter) revert EventNotFound();

        EventItem storage item = _events[eventId];

        if (item.organizer != msg.sender) revert NotOrganizer();
        if (item.status == EventStatus.Cancelled || item.status == EventStatus.Completed) {
            revert InvalidStatusTransition();
        }

        item.status = EventStatus.Completed;
        emit EventCompleted(eventId, msg.sender);
    }

    /**
     * @notice Returns details of a specific event.
     * @param eventId The unique ID of the event
     */
    function getEvent(uint256 eventId) external view returns (EventItem memory) {
        if (eventId == 0 || eventId > _eventIdCounter) revert EventNotFound();
        return _events[eventId];
    }

    /**
     * @notice Returns all created events.
     */
    function getAllEvents() external view returns (EventItem[] memory) {
        uint256 total = _eventIdCounter;
        EventItem[] memory allItems = new EventItem[](total);

        for (uint256 i = 1; i <= total; i++) {
            allItems[i - 1] = _events[i];
        }

        return allItems;
    }

    /**
     * @notice Returns all events created by the caller.
     */
    function getMyEvents() external view returns (EventItem[] memory) {
        uint256[] storage eventIds = _organizerEvents[msg.sender];
        uint256 count = eventIds.length;
        EventItem[] memory items = new EventItem[](count);

        for (uint256 i = 0; i < count; i++) {
            items[i] = _events[eventIds[i]];
        }

        return items;
    }

    /**
     * @notice Returns all events the caller has registered for.
     */
    function getMyRegistrations() external view returns (EventItem[] memory) {
        uint256[] storage eventIds = _userRegistrations[msg.sender];
        uint256 count = eventIds.length;
        EventItem[] memory items = new EventItem[](count);

        for (uint256 i = 0; i < count; i++) {
            items[i] = _events[eventIds[i]];
        }

        return items;
    }

    /**
     * @notice Checks whether an address has registered for a given event.
     * @param eventId The unique ID of the event
     * @param user The wallet address to query
     */
    function hasRegistered(uint256 eventId, address user) external view returns (bool) {
        return _registrations[eventId][user];
    }

    /**
     * @notice Returns the total number of events created so far.
     */
    function getTotalEvents() external view returns (uint256) {
        return _eventIdCounter;
    }
}

