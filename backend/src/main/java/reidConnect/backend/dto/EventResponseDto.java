package reidConnect.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import reidConnect.backend.enums.EventCategory;
import reidConnect.backend.enums.Faculties;
import reidConnect.backend.enums.Years;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class EventResponseDto {
    private Long id;
    private Long clubId;
    private String name;
    private String description;
    private Long venueId;
    private String venueName;
    private LocalDate date;
    private String imagePath;
    private List<Long> slotIds;
    private LocalDateTime createdAt;
    private List<Years> targetYears;
    private List<Faculties> targetFaculties;
    private EventCategory category;

}
