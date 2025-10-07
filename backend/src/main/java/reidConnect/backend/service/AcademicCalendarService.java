package reidConnect.backend.service;

import reidConnect.backend.dto.AcademicCalendarDto;

import java.util.List;

public interface AcademicCalendarService {
    AcademicCalendarDto createPeriod(AcademicCalendarDto dto);
    AcademicCalendarDto updatePeriod(Long id, AcademicCalendarDto dto);
    void deletePeriod(Long id);
    AcademicCalendarDto getPeriod(Long id);
    List<AcademicCalendarDto> getAllPeriods();
    AcademicCalendarDto getCurrentPeriod();
}