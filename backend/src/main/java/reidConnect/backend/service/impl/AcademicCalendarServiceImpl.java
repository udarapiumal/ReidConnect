package reidConnect.backend.service.impl;

import reidConnect.backend.enums.PeriodType;
import reidConnect.backend.enums.TimetableStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reidConnect.backend.dto.AcademicCalendarDto;
import reidConnect.backend.entity.AcademicCalendar;
import reidConnect.backend.repository.*;
import reidConnect.backend.service.AcademicCalendarService;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AcademicCalendarServiceImpl implements AcademicCalendarService {

    private final AcademicCalendarRepository repository;
    private final OccupiedStaffRepository occupiedStaffRepository;
    private final OccupiedVenueRepository occupiedVenueRepository;
    private final TimeTableApprovalRepository timeTableApprovalRepository;
    private final TimeTableRepository timeTableRepository;

    private AcademicCalendarDto mapToDto(AcademicCalendar p) {
        return AcademicCalendarDto.builder()
                .id(p.getId())
                .title(p.getTitle())
                .startDate(p.getStartDate())
                .endDate(p.getEndDate())
                .academicYear(p.getAcademicYear())
                .intake(p.getIntake())
                .periodType(p.getPeriodType())
                .build();
    }

    private AcademicCalendar mapToEntity(AcademicCalendarDto dto) {
        return AcademicCalendar.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .academicYear(dto.getAcademicYear())
                .intake(dto.getIntake())
                .periodType(dto.getPeriodType())
                .build();
    }

    @Override
    public AcademicCalendarDto createPeriod(AcademicCalendarDto dto) {
        AcademicCalendar entity = mapToEntity(dto);
        return mapToDto(repository.save(entity));
    }

    @Override
    public AcademicCalendarDto updatePeriod(Long id, AcademicCalendarDto dto) {
        AcademicCalendar existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("AcademicPeriod not found"));
        existing.setTitle(dto.getTitle());
        existing.setStartDate(dto.getStartDate());
        existing.setEndDate(dto.getEndDate());
        existing.setAcademicYear(dto.getAcademicYear());
        existing.setIntake(dto.getIntake());
        existing.setPeriodType(dto.getPeriodType());
        return mapToDto(repository.save(existing));
    }

    @Override
    public void deletePeriod(Long id) {
        repository.deleteById(id);
    }

    @Override
    @Transactional
    public void deleteEntireTimetable(Long academicCalendarId) {
        AcademicCalendar calendar = repository.findById(academicCalendarId)
                .orElseThrow(() -> new RuntimeException("Academic Calendar not found"));

        // 1. Delete occupied staff records (references both academic_calendar and
        // time_table)
        occupiedStaffRepository.deleteByAcademicCalendar_Id(academicCalendarId);

        // 2. Delete occupied venue records (references both academic_calendar and
        // time_table)
        occupiedVenueRepository.deleteByAcademicCalendar_Id(academicCalendarId);

        // 3. Delete approval history
        timeTableApprovalRepository.deleteByAcademicCalendar_Id(academicCalendarId);

        // 4. Delete timetable entries (cascades to time_table_slots via
        // CascadeType.ALL)
        timeTableRepository.deleteByAcademicCalendar_Id(academicCalendarId);

        // 5. Reset status back to DRAFT
        calendar.setTimetableStatus(TimetableStatus.DRAFT);
        repository.save(calendar);
    }

    @Override
    public AcademicCalendarDto getPeriod(Long id) {
        return repository.findById(id).map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("Period not found"));
    }

    @Override
    public List<AcademicCalendarDto> getAllPeriods() {
        return repository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public AcademicCalendarDto getCurrentPeriod() {
        return repository.findCurrentPeriod(LocalDate.now())
                .map(this::mapToDto)
                .orElse(AcademicCalendarDto.builder()
                        .title("No Active Period")
                        .periodType(PeriodType.OTHER)
                        .build());
    }
}
