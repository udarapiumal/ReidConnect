package reidConnect.backend.dto.timetable;

import lombok.Data;
import reidConnect.backend.enums.CourseType;
import reidConnect.backend.enums.Degree;
import reidConnect.backend.enums.Groups;
import reidConnect.backend.enums.Years;

import java.util.List;
import java.util.Set;

@Data
public class TimeTableResponseDto {
    private Long id;
    private String day;
    private String courseCode;
    private String courseName;
    private CourseType courseType;
    private Groups group;
    private List<Long> slotIds;
    private String lecturerCodes; // Comma-separated lecturer codes
    private String lecturerNames; // Comma-separated lecturer names
    private String venue; // Based on course type
    private Degree degree;
    private Years year;
    private Integer lectureCredits;
    private Integer practicalCredits;
    private Long academicCalendarId;
    private String academicCalendarTitle;
}
