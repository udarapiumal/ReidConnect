package reidConnect.backend.dto.course;

import lombok.Data;
import reidConnect.backend.enums.Degree;
import reidConnect.backend.enums.Years;

import java.util.Set;

@Data
public class CourseRequestDto {
    private String code;
    private String name;
    private int lectureCredits;
    private int practicalCredits;
    private Set<Long> lecturerIds;
    private Long lectureVenueId;
    private Long practicalVenueId;
    private Long tutorialVenueId;
    private Degree degree;
    private Years year;

}
