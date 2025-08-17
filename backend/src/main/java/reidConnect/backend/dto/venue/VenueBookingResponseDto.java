package reidConnect.backend.dto.venue;

import lombok.Getter;
import lombok.Setter;
import reidConnect.backend.enums.BookingStatus;
import reidConnect.backend.enums.VenueBookingStatus;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class VenueBookingResponseDto {
    private Long id;
    private Long clubId;
    private String clubName;
    private String registrationNumber;
    private String contactNumber;
    private Long venueId;
    private List<Long> slotIds; // half-hour slots for that date
    private LocalDate date;
    private String reason;
    private BookingStatus status;
    private String envelopeId;
}
