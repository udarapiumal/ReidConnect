package reidConnect.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import reidConnect.backend.enums.EventCategory;
import reidConnect.backend.enums.Faculties;
import reidConnect.backend.enums.Years;

import java.time.LocalDate;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class EventRequestDto {
    private Long clubId;
    private String name;
    private String description;
    private Long venueId;      // optional
    private String venueName;  // optional if venueId not provided
    private LocalDate date;
    private String imagePath;
    private List<Long> slotIds;  // required for selecting time slots
    private List<Years> targetYears;
    private List<Faculties> targetFaculties;
    private EventCategory category;
}
