package reidConnect.backend.dto.course;

import lombok.Data;

import java.util.Set;

@Data
public class CourseResponseDto {
    private Long id;
    private String code;
    private String name;
    private int credits;
    private Set<String> lecturerNames;
}
