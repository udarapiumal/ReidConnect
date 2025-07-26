package reidConnect.backend.mapper;

import org.springframework.stereotype.Component;
import reidConnect.backend.dto.course.CourseRequestDto;
import reidConnect.backend.dto.course.CourseResponseDto;
import reidConnect.backend.entity.Course;
import reidConnect.backend.entity.Staff;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class CourseMapper {

    public CourseResponseDto toDto(Course course) {
        CourseResponseDto dto = new CourseResponseDto();
        dto.setId(course.getId());
        dto.setCode(course.getCode());
        dto.setName(course.getName());
        dto.setCredits(course.getCredits());

        Set<String> lecturerNames = course.getLecturers()
                .stream()
                .map(Staff::getName)
                .collect(Collectors.toSet());

        dto.setLecturerNames(lecturerNames);
        return dto;
    }

    public void updateCourseFromDto(Course course, CourseRequestDto dto, Set<Staff> lecturers) {
        course.setCode(dto.getCode());
        course.setName(dto.getName());
        course.setCredits(dto.getCredits());
        course.setLecturers(lecturers);
    }
}
