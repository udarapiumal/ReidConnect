package reidConnect.backend.service;

import reidConnect.backend.dto.venue.OccupiedVenueDto;

import java.util.List;

public interface OccupiedVenueService {
    void addOccupiedVenues(List<OccupiedVenueDto> dtos);

    boolean hasVenueClash(Long venueId, String day, List<Long> slotIds, Long academicCalendarId);
}
