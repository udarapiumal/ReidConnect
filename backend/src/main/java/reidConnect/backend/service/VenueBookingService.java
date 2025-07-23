package reidConnect.backend.service;

import reidConnect.backend.dto.venue.VenueBookingRequestDto;
import reidConnect.backend.dto.venue.VenueBookingResponseDto;

import java.util.List;

public interface VenueBookingService {
    void createVenueBooking(VenueBookingRequestDto dto);
    List<VenueBookingResponseDto> getAllBookings();
}
