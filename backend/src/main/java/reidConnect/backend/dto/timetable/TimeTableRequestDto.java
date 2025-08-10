package reidConnect.backend.dto.timetable;

import lombok.Data;
import reidConnect.backend.enums.CourseType;
import reidConnect.backend.enums.Degree;
import reidConnect.backend.enums.Groups;
import reidConnect.backend.enums.Years;

import java.util.Set;

@Data
public class TimeTableRequestDto {
    private String day;
    private Long courseId;
    private CourseType courseType;
    private Groups group;
    private Set<Long> slotIds;
}
