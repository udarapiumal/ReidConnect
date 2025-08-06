package reidConnect.backend.service;

import reidConnect.backend.dto.course.CourseRequestDto;
import reidConnect.backend.dto.course.CourseResponseDto;
import reidConnect.backend.enums.Degree;
import reidConnect.backend.enums.Years;

import java.util.List;

public interface CourseService {
    CourseResponseDto createCourse(CourseRequestDto dto);
    CourseResponseDto getCourseById(Long id);
    List<CourseResponseDto> getAllCourses();
    CourseResponseDto updateCourse(Long id, CourseRequestDto dto);
    void deleteCourse(Long id);
    List<CourseResponseDto> getCoursesByDegree(Degree degree);
    List<CourseResponseDto> getCoursesByDegreeAndYear(Degree degree, Years year);
}
