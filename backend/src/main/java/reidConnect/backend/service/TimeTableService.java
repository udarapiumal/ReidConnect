package reidConnect.backend.service;

import java.util.List;
import reidConnect.backend.dto.timetable.TimeTableRequestDto;
import reidConnect.backend.dto.timetable.TimeTableResponseDto;
import reidConnect.backend.enums.Degree;
import reidConnect.backend.enums.Years;

public interface TimeTableService {
    TimeTableResponseDto create(TimeTableRequestDto dto);

    TimeTableResponseDto getById(Long id);

    List<TimeTableResponseDto> getAll();

    TimeTableResponseDto update(Long id, TimeTableRequestDto dto);

    void delete(Long id);

    List<TimeTableResponseDto> getByYearAndDegree(Degree degree, Years year, Long academicCalendarId);

    List<TimeTableResponseDto> getByDay(String day, Long academicCalendarId);

    long countSessionsToday(Long academicCalendarId);

    List<TimeTableResponseDto> getByYearAndDegreeApproved(Degree degree, Years year, Long academicCalendarId);
}
