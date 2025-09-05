package reidConnect.backend.service;

import reidConnect.backend.dto.timetable.TimeTableRequestDto;
import reidConnect.backend.dto.timetable.TimeTableResponseDto;
import reidConnect.backend.entity.TimeTable;
import reidConnect.backend.enums.Degree;
import reidConnect.backend.enums.Years;

import java.util.List;

public interface TimeTableService {
    TimeTableResponseDto create(TimeTableRequestDto dto);
    TimeTableResponseDto getById(Long id);
    List<TimeTableResponseDto> getAll();
    TimeTableResponseDto update(Long id, TimeTableRequestDto dto);
    void delete(Long id);
    List<TimeTableResponseDto> getByYearAndDegree(Degree degree, Years year);
    List<TimeTableResponseDto> getByDay(String day);


}
