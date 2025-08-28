package reidConnect.backend.dto.venue;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class VenueBookingRequestDto {
    private Long venueId;
    private List<Long> slotIds;
    private String clubName;
    private String registrationNumber;
    private String contactNumber;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate date;
    private String reason;
    private String bookingData;
    private String clubSignatureImage;
}