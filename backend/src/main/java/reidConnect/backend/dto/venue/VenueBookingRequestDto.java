package reidConnect.backend.dto.venue;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class VenueBookingRequestDto {
    private Long clubId;
    private Long venueId;
    private LocalDate requestedDate;
    private String reason;
    private String applicantName;
    private String registrationNumber;
    private String contactNumber;
    private List<Long> slotIds;
}