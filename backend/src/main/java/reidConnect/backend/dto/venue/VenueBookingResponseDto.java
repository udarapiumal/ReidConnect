package reidConnect.backend.dto.venue;

import lombok.Data;
import reidConnect.backend.entity.Slot;

import java.time.LocalDate;
import java.util.List;

@Data
public class VenueBookingResponseDto {
    private Long bookingId;
    private String clubName;
    private String registrationNumber;
    private String contactNumber;
    private LocalDate date;
    private String reason;
    private String status;
    private Long venueId;
    private String venueName;
    private List<Slot> slotIds;

    private String clubSignatureImage;
    private String sarSignatureImage;
    private String finalSignatureImage;
}
