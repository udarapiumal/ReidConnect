package reidConnect.backend.service;

import reidConnect.backend.dto.EventRequestDto;
import reidConnect.backend.dto.EventResponseDto;
import reidConnect.backend.dto.EventUpdateDto;
import reidConnect.backend.enums.Faculties;
import reidConnect.backend.enums.Years;

import java.util.List;

public interface EventService {
    EventResponseDto createEvent(EventRequestDto dto);
    EventResponseDto updateEvent(Long id, EventUpdateDto dto);
    void deleteEvent(Long id);
    EventResponseDto getEventById(Long id);
    List<EventResponseDto> getAllEvents();
    boolean doAllSlotsExist(List<Long> slotIds);
    List<EventResponseDto> getEventsByFacultiesAndYears(List<Faculties> faculties, List<Years> years);


}
