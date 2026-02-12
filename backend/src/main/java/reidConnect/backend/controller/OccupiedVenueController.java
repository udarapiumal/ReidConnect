package reidConnect.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reidConnect.backend.dto.venue.OccupiedVenueDto;
import reidConnect.backend.service.OccupiedVenueService;

import java.util.List;

@RestController
@RequestMapping("/api/occupied-venues")
@RequiredArgsConstructor
public class OccupiedVenueController {

    private final OccupiedVenueService occupiedVenueService;

    @PostMapping("/check")
    public ResponseEntity<Boolean> checkVenueClash(@RequestParam Long venueId,
            @RequestParam String day,
            @RequestParam Long academicCalendarId,
            @RequestBody List<Long> slotIds) {
        boolean clash = occupiedVenueService.hasVenueClash(venueId, day, slotIds, academicCalendarId);
        return ResponseEntity.ok(clash);
    }

    @PostMapping
    public ResponseEntity<String> addOccupiedVenues(@RequestBody List<OccupiedVenueDto> dtos) {
        occupiedVenueService.addOccupiedVenues(dtos);
        return ResponseEntity.ok("Occupied venue entries added successfully");
    }
}
