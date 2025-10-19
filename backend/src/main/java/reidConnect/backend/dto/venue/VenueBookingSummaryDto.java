package reidConnect.backend.dto.venue;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class VenueBookingSummaryDto {
    private Long bookingId;
    private String clubName;
    private String registrationNumber;
    private String contactNumber;
    private LocalDate date;
    private String reason;
    private String status;
    private Long venueId;
    private String venueName;
    private List<SlotDto> slotIds;

    @Data
    public static class SlotDto {
        private Long id;
        private String startTime;
        private String endTime;
    }
}
