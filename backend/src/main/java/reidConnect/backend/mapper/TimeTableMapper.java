package reidConnect.backend.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import reidConnect.backend.dto.timetable.TimeTableResponseDto;
import reidConnect.backend.entity.*;
import reidConnect.backend.enums.CourseType;

import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class TimeTableMapper {

    public TimeTableResponseDto toDto(TimeTable entity) {
        TimeTableResponseDto dto = new TimeTableResponseDto();
        Course course = entity.getCourse();

        // Basic timetable info
        dto.setId(entity.getId());
        dto.setDay(entity.getDay());
        dto.setCourseType(entity.getCourseType());
        dto.setGroup(entity.getGroup());

        // Course information
        dto.setCourseCode(course.getCode());
        dto.setCourseName(course.getName());
        dto.setDegree(course.getDegree());
        dto.setYear(course.getYear());
        dto.setCredits(course.getCredits());

        // Slot IDs - sorted by slot ID for proper time ordering
        dto.setSlotIds(
                entity.getSlots().stream()
                        .map(timeTableSlot -> timeTableSlot.getSlot().getId())
                        .sorted()
                        .collect(Collectors.toList())
        );

        // Lecturer information
        String lecturerCodes = course.getLecturers().stream()
                .map(Staff::getCode)
                .collect(Collectors.joining(", "));
        String lecturerNames = course.getLecturers().stream()
                .map(Staff::getName)
                .collect(Collectors.joining(", "));

        dto.setLecturerCodes(lecturerCodes);
        dto.setLecturerNames(lecturerNames);

        // Venue based on course type
        dto.setVenue(getVenueForCourseType(course, entity.getCourseType()));

        return dto;
    }

    private String getVenueForCourseType(Course course, CourseType courseType) {
        return switch (courseType) {
            case LECTURE -> course.getLectureVenue() != null ? course.getLectureVenue().getName() : "TBA";
            case PRACTICAL -> course.getPracticalVenue() != null ? course.getPracticalVenue().getName() : "TBA";
            case TUTORIAL -> course.getTutorialVenue() != null ? course.getTutorialVenue().getName() : "TBA";
            default -> "TBA";
        };
    }
}