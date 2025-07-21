package reidConnect.backend.dto.course;

import lombok.Data;

import java.util.Set;

@Data
public class CourseRequestDto {
    private String code;
    private String name;
    private int credits;
    private Set<Long> lecturerIds;
}
