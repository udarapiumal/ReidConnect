package reidConnect.backend.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import reidConnect.backend.dto.venue.VenueBookingResponseDto;
import reidConnect.backend.entity.VenueBooking;
import reidConnect.backend.repository.VenueRepository;

import java.util.Base64;

@Component
@RequiredArgsConstructor
public class VenueBookingMapper {

    public VenueBookingResponseDto toDto(VenueBooking booking) {
        VenueBookingResponseDto dto = new VenueBookingResponseDto();

        dto.setBookingId(booking.getId());
        dto.setClubName(booking.getClubName());
        dto.setRegistrationNumber(booking.getRegistrationNumber());
        dto.setContactNumber(booking.getContactNumber());
        dto.setDate(booking.getDate());
        dto.setReason(booking.getReason());
        dto.setStatus(booking.getStatus().name());
        dto.setVenueId(booking.getVenue().getId());
        dto.setVenueName(booking.getVenue().getName());
        dto.setSlotIds(booking.getSlots());

        // Convert byte[] -> Base64 String for JSON
        dto.setClubSignatureImage(
                booking.getClubSignatureImage() != null
                        ? Base64.getEncoder().encodeToString(booking.getClubSignatureImage())
                        : null
        );
        dto.setSarSignatureImage(
                booking.getSarSignatureImage() != null
                        ? Base64.getEncoder().encodeToString(booking.getSarSignatureImage())
                        : null
        );
        dto.setFinalSignatureImage(
                booking.getFinalSignatureImage() != null
                        ? Base64.getEncoder().encodeToString(booking.getFinalSignatureImage())
                        : null
        );

        return dto;
    }
}
