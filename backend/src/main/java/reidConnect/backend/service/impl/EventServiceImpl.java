package reidConnect.backend.service.impl;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import reidConnect.backend.dto.EventRequestDto;
import reidConnect.backend.dto.EventResponseDto;
import reidConnect.backend.dto.EventUpdateDto;
import reidConnect.backend.dto.PostResponseDto;
import reidConnect.backend.entity.*;
import reidConnect.backend.enums.EventAttendanceStatus;
import reidConnect.backend.enums.Faculties;
import reidConnect.backend.enums.Years;
import reidConnect.backend.mapper.EventMapper;
import reidConnect.backend.repository.*;
import reidConnect.backend.service.EventService;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final EventSlotRepository eventSlotRepository;
    private final ClubRepository clubRepository;
    private final VenueRepository venueRepository;
    private final SlotRepository slotRepository;
    private final EventYearRepository eventYearRepository;
    private final EventFacultyRepository eventFacultyRepository;
    private final UserRepository userRepository;
    private final EventAttendanceRepository attendanceRepository;

    public EventServiceImpl(EventRepository eventRepository,
                            EventSlotRepository eventSlotRepository,
                            ClubRepository clubRepository,
                            VenueRepository venueRepository,
                            SlotRepository slotRepository,
                            EventYearRepository eventYearRepository,
                            EventFacultyRepository eventFacultyRepository,
                            UserRepository userRepository,
                            EventAttendanceRepository eventAttendanceRepository) {
        this.eventRepository = eventRepository;
        this.eventSlotRepository = eventSlotRepository;
        this.clubRepository = clubRepository;
        this.venueRepository = venueRepository;
        this.slotRepository = slotRepository;
        this.eventYearRepository = eventYearRepository;
        this.eventFacultyRepository = eventFacultyRepository;
        this.userRepository = userRepository;
        this.attendanceRepository = eventAttendanceRepository;
    }

    @Override
    public EventResponseDto createEvent(EventRequestDto dto) {
        Club club = clubRepository.findById(dto.getClubId())
                .orElseThrow(() -> new RuntimeException("Club not found"));

        Venue venue = dto.getVenueId() != null
                ? venueRepository.findById(dto.getVenueId()).orElse(null)
                : null;

        Event event = EventMapper.toEntity(dto, club, venue);
        event = eventRepository.save(event);

        // Save event-slot mappings
        List<Slot> slots = slotRepository.findAllById(dto.getSlotIds());
        Event finalEvent = event;
        List<EventSlot> eventSlots = slots.stream()
                .map(slot -> new EventSlot(finalEvent, slot))
                .collect(Collectors.toList());
        eventSlotRepository.saveAll(eventSlots);

        // Save target years
        Event finalEvent1 = event;
        List<EventYear> eventYears = dto.getTargetYears().stream()
                .map(year -> new EventYear(year, finalEvent1))
                .collect(Collectors.toList());
        eventYearRepository.saveAll(eventYears);

        // Save target faculties
        Event finalEvent2 = event;
        List<EventFaculty> eventFaculties = dto.getTargetFaculties().stream()
                .map(faculty -> new EventFaculty(faculty, finalEvent2))
                .collect(Collectors.toList());
        eventFacultyRepository.saveAll(eventFaculties);

        event.setTargetYears(eventYears);
        event.setTargetFaculties(eventFaculties);

        return EventMapper.toResponseDto(event, dto.getSlotIds());
    }

    @Override
    public EventResponseDto updateEvent(Long id, EventUpdateDto dto) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        Venue venue = dto.getVenueId() != null
                ? venueRepository.findById(dto.getVenueId()).orElse(null)
                : null;

        // Update base fields (excluding collections)
        EventMapper.updateEntity(event, dto, venue);

        // ✅ Clear and repopulate target years
        event.getTargetYears().clear();
        dto.getTargetYears().forEach(year ->
                event.getTargetYears().add(new EventYear(year, event))
        );

        // ✅ Clear and repopulate target faculties
        event.getTargetFaculties().clear();
        dto.getTargetFaculties().forEach(faculty ->
                event.getTargetFaculties().add(new EventFaculty(faculty, event))
        );

        // ✅ Update slots separately
        eventSlotRepository.deleteByEventId(event.getId());
        List<Slot> slots = slotRepository.findAllById(dto.getSlotIds());
        List<EventSlot> eventSlots = slots.stream()
                .map(slot -> new EventSlot(event, slot))
                .collect(Collectors.toList());
        eventSlotRepository.saveAll(eventSlots);

        // ✅ Save the updated event (cascades targetFaculties and targetYears)
        Event savedEvent = eventRepository.save(event);

        return EventMapper.toResponseDto(savedEvent, dto.getSlotIds());
    }


    @Override
    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new RuntimeException("Event not found");
        }
        eventSlotRepository.deleteByEventId(id);
        eventYearRepository.deleteByEventId(id);
        eventFacultyRepository.deleteByEventId(id);
        eventRepository.deleteById(id);
    }

    @Override
    public EventResponseDto getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        List<Long> slotIds = eventSlotRepository.findByEventId(id)
                .stream()
                .map(es -> es.getSlot().getId())
                .collect(Collectors.toList());

        return EventMapper.toResponseDto(event, slotIds);
    }

    @Override
    public List<EventResponseDto> getEventsByClubId(Long clubId) {
        List<Event> events = eventRepository.findAllByClub_IdOrderByCreatedAtDesc(clubId);
        return events.stream()
                .map(EventMapper::mapToEventResponseDto)
                .toList();
    }


    @Override
    public List<EventResponseDto> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(event -> {
                    List<Long> slotIds = eventSlotRepository.findByEventId(event.getId())
                            .stream()
                            .map(es -> es.getSlot().getId())
                            .collect(Collectors.toList());
                    return EventMapper.toResponseDto(event, slotIds);
                })
                .collect(Collectors.toList());
    }

    @Override
    public boolean doAllSlotsExist(List<Long> slotIds) {
        long count = slotRepository.countByIdIn(slotIds);
        return count == slotIds.size();
    }

    @Override
    public List<EventResponseDto> getEventsByFacultiesAndYears(List<Faculties> faculties, List<Years> years) {
        List<Event> allEvents = eventRepository.findAll();

        return allEvents.stream()
                .filter(event ->
                        event.getTargetFaculties().stream().anyMatch(f -> faculties.contains(f.getFaculty())) &&
                                event.getTargetYears().stream().anyMatch(y -> years.contains(y.getYear()))
                )
                .map(event -> {
                    List<Long> slotIds = eventSlotRepository.findByEventId(event.getId())
                            .stream()
                            .map(es -> es.getSlot().getId())
                            .collect(Collectors.toList());
                    return EventMapper.toResponseDto(event, slotIds);
                })
                .collect(Collectors.toList());
    }

    @Override
    public void markAttendance(Long eventId, Long userId, EventAttendanceStatus status) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // If already marked, do not allow duplicate
        if (attendanceRepository.findByEventAndUser(event, user).isPresent()) {
            throw new RuntimeException("Attendance already exists. Use update instead.");
        }

        EventAttendance attendance = new EventAttendance();
        attendance.setEvent(event);
        attendance.setUser(user);
        attendance.setStatus(status);

        attendanceRepository.save(attendance);
    }

    @Override
    public void updateAttendanceStatus(Long eventId, Long userId, EventAttendanceStatus newStatus) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        EventAttendance attendance = attendanceRepository.findByEventAndUser(event, user)
                .orElseThrow(() -> new RuntimeException("Attendance record not found"));

        attendance.setStatus(newStatus);
        attendanceRepository.save(attendance);
    }

    @Override
    public void removeAttendance(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        attendanceRepository.deleteByEventAndUser(event, user);
    }
    @Override
    public long countGoingAttendance(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return attendanceRepository.countByEventAndStatus(event, EventAttendanceStatus.GOING);
    }

    @Override
    public long countInterestedAttendance(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return attendanceRepository.countByEventAndStatus(event, EventAttendanceStatus.INTERESTED);
    }

}
