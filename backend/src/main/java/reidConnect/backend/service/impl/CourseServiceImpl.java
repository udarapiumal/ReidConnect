package reidConnect.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reidConnect.backend.dto.course.CourseRequestDto;
import reidConnect.backend.dto.course.CourseResponseDto;
import reidConnect.backend.entity.Course;
import reidConnect.backend.entity.Staff;
import reidConnect.backend.exception.ResourceNotFoundException;
import reidConnect.backend.mapper.CourseMapper;
import reidConnect.backend.repository.CourseRepository;
import reidConnect.backend.repository.StaffRepository;
import reidConnect.backend.service.CourseService;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final StaffRepository staffRepository;
    private final CourseMapper courseMapper;

    @Override
    @Transactional
    public CourseResponseDto createCourse(CourseRequestDto dto) {
        Set<Staff> lecturers = staffRepository.findAllById(dto.getLecturerIds()).stream().collect(Collectors.toSet());
        Course course = new Course();
        courseMapper.updateCourseFromDto(course, dto, lecturers);
        return courseMapper.toDto(courseRepository.save(course));
    }

    @Override
    public CourseResponseDto getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        return courseMapper.toDto(course);
    }

    @Override
    public List<CourseResponseDto> getAllCourses() {
        return courseRepository.findAll()
                .stream()
                .map(courseMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CourseResponseDto updateCourse(Long id, CourseRequestDto dto) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        Set<Staff> lecturers = staffRepository.findAllById(dto.getLecturerIds()).stream().collect(Collectors.toSet());
        courseMapper.updateCourseFromDto(course, dto, lecturers);
        return courseMapper.toDto(courseRepository.save(course));
    }

    @Override
    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Course not found");
        }
        courseRepository.deleteById(id);
    }
}
