package reidConnect.backend.dto.course;

import lombok.Data;
import reidConnect.backend.enums.Degree;
import reidConnect.backend.enums.Years;

import java.util.Set;

@Data
public class CourseResponseDto {
    private Long id;
    private String code;
    private String name;
    private int lectureCredits;
    private int practicalCredits;
    private Set<String> lecturerNames;
    private String lectureVenueName;
    private String practicalVenueName;
    private String tutorialVenueName;
    private Degree degree;
    private Years year;

}
