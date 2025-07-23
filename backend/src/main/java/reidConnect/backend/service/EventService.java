package reidConnect.backend.service;

import java.util.List;
import reidConnect.backend.dto.EventAttendanceCountDto;
import reidConnect.backend.dto.EventRequestDto;
import reidConnect.backend.dto.EventResponseDto;
import reidConnect.backend.dto.EventUpdateDto;
import reidConnect.backend.dto.UserEventAttendanceDto;
import reidConnect.backend.enums.EventAttendanceStatus;
import reidConnect.backend.enums.Faculties;
import reidConnect.backend.enums.Years;

public interface EventService {
    EventResponseDto createEvent(EventRequestDto dto);
    EventResponseDto updateEvent(Long id, EventUpdateDto dto);
    void deleteEvent(Long id);
    EventResponseDto getEventById(Long id);
    List<EventResponseDto> getEventsByClubId(Long clubId);
    List<EventResponseDto> getAllEvents();
    boolean doAllSlotsExist(List<Long> slotIds);
    List<EventResponseDto> getEventsByFacultiesAndYears(List<Faculties> faculties, List<Years> years);

    void markAttendance(Long eventId, Long userId, EventAttendanceStatus status);
    void updateAttendanceStatus(Long eventId, Long userId, EventAttendanceStatus newStatus);
    void removeAttendance(Long eventId, Long userId);

    long countGoingAttendance(Long eventId);     // ✅
    long countInterestedAttendance(Long eventId); // ✅

    long countAllEvents();
    long countEventsInLast28Days();

    long countAllEventsByClubId(Long clubId);
    long countRecentEventsByClubId(Long clubId);

    EventAttendanceCountDto getEventAttendanceCounts(Long eventId);
    UserEventAttendanceDto getUserEventAttendanceStatus(Long eventId, Long userId);

    void featureEvent(Long eventId);
    void unfeatureEvent(Long eventId);
    List<EventResponseDto> getFeaturedEventsWithinOneMonth();


}
