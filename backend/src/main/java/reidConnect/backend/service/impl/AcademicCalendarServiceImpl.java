package reidConnect.backend.service.impl;

import reidConnect.backend.enums.PeriodType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reidConnect.backend.dto.AcademicCalendarDto;
import reidConnect.backend.entity.AcademicCalendar;
import reidConnect.backend.repository.AcademicCalendarRepository;
import reidConnect.backend.service.AcademicCalendarService;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AcademicCalendarServiceImpl implements AcademicCalendarService {

    private final AcademicCalendarRepository repository;

    private AcademicCalendarDto mapToDto(AcademicCalendar p) {
        return AcademicCalendarDto.builder()
                .id(p.getId())
                .title(p.getTitle())
                .startDate(p.getStartDate())
                .endDate(p.getEndDate())
                .periodType(p.getPeriodType())
                .build();
    }

    private AcademicCalendar mapToEntity(AcademicCalendarDto dto) {
        return AcademicCalendar.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
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
        existing.setPeriodType(dto.getPeriodType());
        return mapToDto(repository.save(existing));
    }

    @Override
    public void deletePeriod(Long id) {
        repository.deleteById(id);
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
