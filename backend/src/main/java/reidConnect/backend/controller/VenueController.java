package reidConnect.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reidConnect.backend.dto.VenueRequestDto;
import reidConnect.backend.dto.VenueResponseDto;
import reidConnect.backend.service.VenueService;

import java.util.List;

@RestController
@RequestMapping("/api/venues")
@RequiredArgsConstructor
public class VenueController {

    private final VenueService venueService;

    @PostMapping
    public ResponseEntity<VenueResponseDto> create(@RequestBody VenueRequestDto request) {
        return ResponseEntity.ok(venueService.createVenue(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VenueResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(venueService.getVenueById(id));
    }

    @GetMapping
    public ResponseEntity<List<VenueResponseDto>> getAll() {
        return ResponseEntity.ok(venueService.getAllVenues());
    }

    @PutMapping("/{id}")
    public ResponseEntity<VenueResponseDto> update(@PathVariable Long id, @RequestBody VenueRequestDto request) {
        return ResponseEntity.ok(venueService.updateVenue(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        venueService.deleteVenue(id);
        return ResponseEntity.noContent().build();
    }
}
