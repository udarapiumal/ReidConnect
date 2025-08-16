package reidConnect.backend.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import reidConnect.backend.dto.course.CourseRequestDto;
import reidConnect.backend.dto.course.CourseResponseDto;
import reidConnect.backend.entity.Course;
import reidConnect.backend.entity.Staff;
import reidConnect.backend.entity.Venue;
import reidConnect.backend.exception.ResourceNotFoundException;
import reidConnect.backend.repository.VenueRepository;

import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CourseMapper {

    private final VenueRepository venueRepository;

    public CourseResponseDto toDto(Course course) {
        CourseResponseDto dto = new CourseResponseDto();
        dto.setId(course.getId());
        dto.setCode(course.getCode());
        dto.setName(course.getName());
        dto.setLectureCredits(course.getLectureCredits());
        dto.setPracticalCredits(course.getPracticalCredits());

        Set<String> lecturerNames = course.getLecturers()
                .stream()
                .map(Staff::getName)
                .collect(Collectors.toSet());
        dto.setLecturerNames(lecturerNames);

        dto.setLectureVenueName(course.getLectureVenue() != null ? course.getLectureVenue().getName() : null);
        dto.setPracticalVenueName(course.getPracticalVenue() != null ? course.getPracticalVenue().getName() : null);
        dto.setTutorialVenueName(course.getTutorialVenue() != null ? course.getTutorialVenue().getName() : null);
        dto.setDegree(course.getDegree());
        dto.setYear(course.getYear());

        return dto;
    }

    public void updateCourseFromDto(Course course, CourseRequestDto dto, Set<Staff> lecturers) {
        course.setCode(dto.getCode());
        course.setName(dto.getName());
        course.setLectureCredits(dto.getLectureCredits());
        course.setPracticalCredits(dto.getPracticalCredits());
        course.setLecturers(lecturers);
        course.setDegree(dto.getDegree());
        course.setYear(dto.getYear());

        if (dto.getLectureVenueId() != null) {
            course.setLectureVenue(venueRepository.findById(dto.getLectureVenueId())
                    .orElseThrow(() -> new ResourceNotFoundException("Lecture venue not found")));
        } else {
            course.setLectureVenue(null);
        }

        if (dto.getPracticalVenueId() != null) {
            course.setPracticalVenue(venueRepository.findById(dto.getPracticalVenueId())
                    .orElseThrow(() -> new ResourceNotFoundException("Practical venue not found")));
        } else {
            course.setPracticalVenue(null);
        }

        if (dto.getTutorialVenueId() != null) {
            course.setTutorialVenue(venueRepository.findById(dto.getTutorialVenueId())
                    .orElseThrow(() -> new ResourceNotFoundException("Tutorial venue not found")));
        } else {
            course.setTutorialVenue(null);
        }

    }
}
