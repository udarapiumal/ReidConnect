package reidConnect.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reidConnect.backend.dto.timetable.TimeTableRequestDto;
import reidConnect.backend.dto.timetable.TimeTableResponseDto;
import reidConnect.backend.entity.*;
import reidConnect.backend.enums.Degree;
import reidConnect.backend.enums.Years;
import reidConnect.backend.exception.ResourceNotFoundException;
import reidConnect.backend.mapper.TimeTableMapper;
import reidConnect.backend.repository.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TimeTableServiceImpl implements reidConnect.backend.service.TimeTableService {

    private final TimeTableRepository timeTableRepository;
    private final CourseRepository courseRepository;
    private final SlotRepository slotRepository;
    private final TimeTableSlotRepository timeTableSlotRepository;
    private final TimeTableMapper timeTableMapper;

    @Override
    @Transactional
    public TimeTableResponseDto create(TimeTableRequestDto dto) {
        TimeTable tt = new TimeTable();
        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        tt.setDay(dto.getDay());
        tt.setCourse(course);
        tt.setCourseType(dto.getCourseType());
        tt.setGroup(dto.getGroup());

        Set<TimeTableSlot> timeTableSlots = new HashSet<>();
        for (Long slotId : dto.getSlotIds()) {
            Slot slot = slotRepository.findById(slotId)
                    .orElseThrow(() -> new ResourceNotFoundException("Slot not found"));

            TimeTableSlot ts = new TimeTableSlot();
            ts.setSlot(slot);
            ts.setTimeTable(tt);
            timeTableSlots.add(ts);
        }

        tt.setSlots(timeTableSlots);
        timeTableRepository.save(tt);
        return timeTableMapper.toDto(tt);
    }

    @Override
    public TimeTableResponseDto getById(Long id) {
        return timeTableRepository.findById(id)
                .map(timeTableMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Timetable not found"));
    }

    @Override
    public List<TimeTableResponseDto> getAll() {
        return timeTableRepository.findAll()
                .stream()
                .map(timeTableMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TimeTableResponseDto update(Long id, TimeTableRequestDto dto) {
        TimeTable tt = timeTableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Timetable not found"));

        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        tt.setDay(dto.getDay());
        tt.setCourse(course);
        tt.setCourseType(dto.getCourseType());
        tt.setGroup(dto.getGroup());

        tt.getSlots().clear();
        for (Long slotId : dto.getSlotIds()) {
            Slot slot = slotRepository.findById(slotId)
                    .orElseThrow(() -> new ResourceNotFoundException("Slot not found"));

            TimeTableSlot ts = new TimeTableSlot();
            ts.setSlot(slot);
            ts.setTimeTable(tt);
            tt.getSlots().add(ts);
        }

        return timeTableMapper.toDto(timeTableRepository.save(tt));
    }

    @Override
    public void delete(Long id) {
        TimeTable tt = timeTableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Timetable not found"));
        timeTableRepository.delete(tt);
    }

    @Override
    public List<TimeTableResponseDto> getByYearAndDegree(Degree degree, Years year) {
        // Use optimized query with fetch joins to avoid N+1 problems
        List<TimeTable> timeTables = timeTableRepository.findByYearAndDegreeWithDetails(degree, year);

        return timeTables.stream()
                .map(timeTableMapper::toDto)
                .collect(Collectors.toList());
    }
}