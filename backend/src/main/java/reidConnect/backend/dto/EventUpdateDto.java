package reidConnect.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import reidConnect.backend.enums.Faculties;
import reidConnect.backend.enums.Years;

import java.time.LocalDate;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class EventUpdateDto {
    private String name;
    private String description;
    private Long venueId;
    private String venueName;
    private LocalDate date;
    private String imagePath;
    private List<Long> slotIds;
    private List<Years> targetYears;
    private List<Faculties> targetFaculties;
}
