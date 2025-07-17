package reidConnect.backend.mapper;

import reidConnect.backend.dto.EventRequestDto;
import reidConnect.backend.dto.EventResponseDto;
import reidConnect.backend.dto.EventUpdateDto;
import reidConnect.backend.entity.*;
import reidConnect.backend.enums.Faculties;
import reidConnect.backend.enums.Years;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class EventMapper {

    public static Event toEntity(EventRequestDto dto, Club club, Venue venue) {
        Event event = new Event();
        event.setClub(club);
        event.setName(dto.getName());
        event.setDescription(dto.getDescription());
        event.setVenue(venue);
        event.setVenueName(dto.getVenueName());
        event.setDate(dto.getDate());
        event.setImagePath(dto.getImagePath());

        // Create empty lists for now
        event.setTargetYears(new ArrayList<>());
        event.setTargetFaculties(new ArrayList<>());

        return event;
    }

    public static void updateEntity(Event event, EventUpdateDto dto, Venue venue) {
        event.setName(dto.getName());
        event.setDescription(dto.getDescription());
        event.setDate(dto.getDate());

        if (venue != null) {
            event.setVenue(venue);
            event.setVenueName(null); // optional: clear venue name if venue object is provided
        } else {
            event.setVenue(null);
            event.setVenueName(dto.getVenueName());
        }

        if (dto.getImagePath() != null) {
            event.setImagePath(dto.getImagePath());
        }
    }


    public static EventResponseDto toResponseDto(Event event, List<Long> slotIds) {
        List<Years> years = event.getTargetYears().stream()
                .map(EventYear::getYear).collect(Collectors.toList());
        List<Faculties> faculties = event.getTargetFaculties().stream()
                .map(EventFaculty::getFaculty).collect(Collectors.toList());

        return new EventResponseDto(
                event.getId(),
                event.getClub().getId(),
                event.getName(),
                event.getDescription(),
                event.getVenue() != null ? event.getVenue().getId() : null,
                event.getVenueName(),
                event.getDate(),
                event.getImagePath(),
                slotIds,
                event.getCreatedAt(),
                years,
                faculties
        );
    }
}
