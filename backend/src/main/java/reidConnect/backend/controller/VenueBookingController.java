package reidConnect.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reidConnect.backend.dto.venue.VenueBookingRequestDto;
import reidConnect.backend.dto.venue.VenueBookingResponseDto;
import reidConnect.backend.service.VenueBookingService;

import java.util.List;

@RestController
@RequestMapping("/api/venue-bookings")
@RequiredArgsConstructor
public class VenueBookingController {

    private final VenueBookingService venueBookingService;

    // Club sends booking request
    @PostMapping("/create")
    public ResponseEntity<String> createBooking(@RequestBody VenueBookingRequestDto dto) {
        venueBookingService.createVenueBooking(dto);
        return ResponseEntity.ok("Booking request submitted successfully.");
    }

    // Clerk views all bookings
    @GetMapping("/all")
    public ResponseEntity<List<VenueBookingResponseDto>> getAllBookings() {
        return ResponseEntity.ok(venueBookingService.getAllBookings());
    }
}
