package reidConnect.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reidConnect.backend.dto.venue.VenueBookingRequestDto;
import reidConnect.backend.dto.venue.VenueBookingResponseDto;
import reidConnect.backend.service.VenueBookingService;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class VenueBookingController {

    private final VenueBookingService bookingService;

    @PostMapping("/create/{clubUserId}")
    public ResponseEntity<VenueBookingResponseDto> createBooking(
            @PathVariable Long clubUserId,
            @RequestBody VenueBookingRequestDto dto
    ) {
        VenueBookingResponseDto response = bookingService.createBooking(clubUserId, dto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/approve/{sarId}/{bookingId}")
    public ResponseEntity<VenueBookingResponseDto> approveBooking(
            @PathVariable Long sarId,
            @PathVariable Long bookingId,
            @RequestBody String sarSignature
    ) {
        VenueBookingResponseDto response = bookingService.approveBooking(sarId, bookingId, sarSignature);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/final-approve/{finalSignerId}/{bookingId}")
    public ResponseEntity<VenueBookingResponseDto> finalApproveBooking(
            @PathVariable Long finalSignerId,
            @PathVariable Long bookingId,
            @RequestBody String finalSignature
    ) {
        VenueBookingResponseDto response = bookingService.finalApproveBooking(finalSignerId, bookingId, finalSignature);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/{bookingId}")
    public ResponseEntity<VenueBookingResponseDto> getBooking(
            @PathVariable Long bookingId
    ) {
        VenueBookingResponseDto response = bookingService.getBookingById(bookingId);
        return ResponseEntity.ok(response);
    }
    @GetMapping
    public ResponseEntity<List<VenueBookingResponseDto>> getAllBookings() {
        List<VenueBookingResponseDto> responses = bookingService.getAllBookings();
        return ResponseEntity.ok(responses);
    }
}
