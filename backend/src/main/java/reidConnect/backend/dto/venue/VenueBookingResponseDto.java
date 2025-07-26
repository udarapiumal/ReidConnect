package reidConnect.backend.dto.venue;

import lombok.Getter;
import lombok.Setter;
import reidConnect.backend.enums.VenueBookingStatus;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class VenueBookingResponseDto {
    private Long id;
    private String clubName;
    private String venueName;
    private LocalDate requestedDate;
    private String reason;
    private String applicantName;
    private String registrationNumber;
    private String contactNumber;
    private VenueBookingStatus status;
    private List<String> slotTimes;
}
