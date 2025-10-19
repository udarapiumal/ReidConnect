package reidConnect.backend.service;

import reidConnect.backend.dto.venue.VenueBookingRequestDto;
import reidConnect.backend.dto.venue.VenueBookingResponseDto;
import reidConnect.backend.dto.venue.VenueBookingSummaryDto;

import java.util.List;

public interface VenueBookingService {

    VenueBookingResponseDto createBooking(Long clubUserId, VenueBookingRequestDto dto);

    VenueBookingResponseDto approveBooking(Long sarId, Long bookingId, String sarSign);

    VenueBookingResponseDto getBookingById(Long bookingId);

    List<VenueBookingResponseDto> getAllBookings();

    VenueBookingResponseDto finalApproveBooking(Long finalSignerId, Long bookingId, String finalSignatureImg);

    long countPendingBookings();

    List<VenueBookingResponseDto> getBookingsByClubId(Long clubId);

    List<VenueBookingSummaryDto> getAllBookingsSummary();

    List<VenueBookingSummaryDto> getBookingsSummaryByClubId(Long clubId);

    List<VenueBookingSummaryDto> getBookingsSummaryByVenueId(Long venueId);

}
