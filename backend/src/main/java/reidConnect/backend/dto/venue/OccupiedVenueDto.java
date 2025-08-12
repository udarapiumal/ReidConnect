package reidConnect.backend.dto.venue;

import lombok.Data;

@Data
public class OccupiedVenueDto {
    private Long venueId;
    private String day;
    private Long slotId;
    private Long timeTableId;
}
