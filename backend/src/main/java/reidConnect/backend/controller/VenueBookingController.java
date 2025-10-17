package reidConnect.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reidConnect.backend.dto.venue.VenueBookingRequestDto;
import reidConnect.backend.dto.venue.VenueBookingResponseDto;
import reidConnect.backend.dto.venue.VenueBookingSummaryDto;
import reidConnect.backend.enums.BookingStatus;
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

    @GetMapping("/club/{clubId}")
    public ResponseEntity<List<VenueBookingResponseDto>> getBookingsByClubId(
            @PathVariable Long clubId
    ) {
        List<VenueBookingResponseDto> responses = bookingService.getBookingsByClubId(clubId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/summary")
    public ResponseEntity<List<VenueBookingSummaryDto>> getAllBookingsSummary() {
        List<VenueBookingSummaryDto> responses = bookingService.getAllBookingsSummary();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/summary/club/{clubId}")
    public ResponseEntity<List<VenueBookingSummaryDto>> getBookingsSummaryByClubId(
            @PathVariable Long clubId
    ) {
        List<VenueBookingSummaryDto> responses = bookingService.getBookingsSummaryByClubId(clubId);
        return ResponseEntity.ok(responses);
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

    @GetMapping("/count/pending")
    public  ResponseEntity<Long> countPendingBookings() {
        return ResponseEntity.ok(bookingService.countPendingBookings());
    }

    @GetMapping("/summary/venue/{venueId}")
    public ResponseEntity<List<VenueBookingSummaryDto>> getBookingsSummaryByVenueId(
            @PathVariable Long venueId
    ) {
        List<VenueBookingSummaryDto> responses = bookingService.getBookingsSummaryByVenueId(venueId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<VenueBookingResponseDto>> getAllBookingsPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<VenueBookingResponseDto> responses = bookingService.getAllBookingsPaged(page, size);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/paged/filter")
    public ResponseEntity<Page<VenueBookingResponseDto>> getBookingsByStatus(
            @RequestParam BookingStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<VenueBookingResponseDto> responses = bookingService.getBookingsByStatus(status, page, size);
        return ResponseEntity.ok(responses);
    }


}
