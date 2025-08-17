package reidConnect.backend.dto.venue;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class VenueBookingRequestDto {
    private Long clubId;
    private String clubName;
    private String registrationNumber;
    private String contactNumber;
    private Long venueId;
    private List<Long> slotIds;
    private LocalDate date;
    private String reason;

}