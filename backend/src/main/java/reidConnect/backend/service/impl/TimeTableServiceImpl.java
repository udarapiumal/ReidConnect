package reidConnect.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reidConnect.backend.dto.staff.OccupiedStaffDto;
import reidConnect.backend.dto.timetable.TimeTableRequestDto;
import reidConnect.backend.dto.timetable.TimeTableResponseDto;
import reidConnect.backend.dto.venue.OccupiedVenueDto;
import reidConnect.backend.entity.*;
import reidConnect.backend.enums.Degree;
import reidConnect.backend.enums.Years;
import reidConnect.backend.exception.ResourceNotFoundException;
import reidConnect.backend.mapper.TimeTableMapper;
import reidConnect.backend.repository.*;
import reidConnect.backend.service.OccupiedStaffService;
import reidConnect.backend.service.OccupiedVenueService;
import reidConnect.backend.service.TimeTableApprovalService;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TimeTableServiceImpl implements reidConnect.backend.service.TimeTableService {

    private final TimeTableRepository timeTableRepository;
    private final CourseRepository courseRepository;
    private final OccupiedVenueRepository occupiedVenueRepository;
    private final SlotRepository slotRepository;
    private final TimeTableSlotRepository timeTableSlotRepository;
    private final TimeTableMapper timeTableMapper;
    private final OccupiedVenueService occupiedVenueService;
    private final OccupiedStaffService occupiedStaffService;
    private final OccupiedStaffRepository occupiedStaffRepository;
    private final TimeTableApprovalService timeTableApprovalService;
    private final AcademicCalendarRepository academicCalendarRepository;

    @Override
    @Transactional
    public TimeTableResponseDto create(TimeTableRequestDto dto) {
        TimeTable tt = new TimeTable();
        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        AcademicCalendar academicCalendar = academicCalendarRepository.findById(dto.getAcademicCalendarId())
                .orElseThrow(() -> new ResourceNotFoundException("Academic Calendar not found"));

        tt.setDay(dto.getDay());
        tt.setCourse(course);
        tt.setCourseType(dto.getCourseType());
        tt.setGroup(dto.getGroup());
        tt.setAcademicCalendar(academicCalendar);

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

        // Save timetable first so it has an ID
        timeTableRepository.save(tt);

        // Determine venueId based on course type
        Long venueId;
        switch (dto.getCourseType()) {
            case LECTURE:
                venueId = course.getLectureVenue() != null ? course.getLectureVenue().getId() : null;
                break;
            case PRACTICAL:
                venueId = course.getPracticalVenue() != null ? course.getPracticalVenue().getId() : null;
                break;
            case TUTORIAL:
                venueId = course.getTutorialVenue() != null ? course.getTutorialVenue().getId() : null;
                break;
            default:
                throw new RuntimeException("Invalid course type");
        }

        if (venueId == null) {
            throw new RuntimeException("Venue not assigned for the course and course type");
        }

        // Now store occupied venue records for clash detection
        List<OccupiedVenueDto> occupiedDtos = dto.getSlotIds().stream()
                .map(slotId -> {
                    OccupiedVenueDto ovDto = new OccupiedVenueDto();
                    ovDto.setVenueId(venueId);
                    ovDto.setDay(dto.getDay());
                    ovDto.setSlotId(slotId);
                    ovDto.setTimeTableId(tt.getId());
                    ovDto.setAcademicCalendarId(academicCalendar.getId());
                    return ovDto;
                })
                .collect(Collectors.toList());

        occupiedVenueService.addOccupiedVenues(occupiedDtos);

        // Build occupied staff DTOs for ALL lecturers in the course
        List<OccupiedStaffDto> occupiedStaffDtos = course.getLecturers().stream()
                .flatMap(staff -> dto.getSlotIds().stream().map(slotId -> {
                    OccupiedStaffDto osDto = new OccupiedStaffDto();
                    osDto.setStaffId(staff.getId());
                    osDto.setDay(dto.getDay());
                    osDto.setSlotId(slotId);
                    osDto.setTimeTableId(tt.getId());
                    osDto.setAcademicCalendarId(academicCalendar.getId());
                    return osDto;
                }))
                .collect(Collectors.toList());

        // Call service to check/add staff occupancy
        occupiedStaffService.addOccupiedStaff(occupiedStaffDtos);

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

        AcademicCalendar academicCalendar = academicCalendarRepository.findById(dto.getAcademicCalendarId())
                .orElseThrow(() -> new ResourceNotFoundException("Academic Calendar not found"));

        // Update timetable fields
        tt.setDay(dto.getDay());
        tt.setCourse(course);
        tt.setCourseType(dto.getCourseType());
        tt.setGroup(dto.getGroup());
        tt.setAcademicCalendar(academicCalendar);

        // Clear and update slots
        tt.getSlots().clear();
        for (Long slotId : dto.getSlotIds()) {
            Slot slot = slotRepository.findById(slotId)
                    .orElseThrow(() -> new ResourceNotFoundException("Slot not found"));

            TimeTableSlot ts = new TimeTableSlot();
            ts.setSlot(slot);
            ts.setTimeTable(tt);
            tt.getSlots().add(ts);
        }

        // Save updated timetable first
        TimeTable updatedTT = timeTableRepository.save(tt);

        // Remove existing occupied venues for this timetable
        occupiedVenueRepository.deleteByTimeTableId(id);

        // Determine new venue based on updated course type
        Long venueId;
        switch (dto.getCourseType()) {
            case LECTURE:
                venueId = course.getLectureVenue() != null ? course.getLectureVenue().getId() : null;
                break;
            case PRACTICAL:
                venueId = course.getPracticalVenue() != null ? course.getPracticalVenue().getId() : null;
                break;
            case TUTORIAL:
                venueId = course.getTutorialVenue() != null ? course.getTutorialVenue().getId() : null;
                break;
            default:
                throw new RuntimeException("Invalid course type");
        }

        if (venueId == null) {
            throw new RuntimeException("Venue not assigned for the course and course type");
        }

        // Build occupied venue DTOs exactly like in create
        List<OccupiedVenueDto> occupiedDtos = dto.getSlotIds().stream()
                .map(slotId -> {
                    OccupiedVenueDto ovDto = new OccupiedVenueDto();
                    ovDto.setVenueId(venueId);
                    ovDto.setDay(dto.getDay());
                    ovDto.setSlotId(slotId);
                    ovDto.setTimeTableId(updatedTT.getId());
                    ovDto.setAcademicCalendarId(academicCalendar.getId());
                    return ovDto;
                })
                .collect(Collectors.toList());

        // Use the service method to add occupied venues — this includes clash detection
        // & exception throwing
        occupiedVenueService.addOccupiedVenues(occupiedDtos);

        // Remove existing occupied staff for this timetable
        occupiedStaffRepository.deleteByTimeTableId(id);

        // Build occupied staff DTOs for ALL lecturers in the course
        List<OccupiedStaffDto> occupiedStaffDtos = course.getLecturers().stream()
                .flatMap(staff -> dto.getSlotIds().stream().map(slotId -> {
                    OccupiedStaffDto osDto = new OccupiedStaffDto();
                    osDto.setStaffId(staff.getId());
                    osDto.setDay(dto.getDay());
                    osDto.setSlotId(slotId);
                    osDto.setTimeTableId(updatedTT.getId());
                    osDto.setAcademicCalendarId(academicCalendar.getId());
                    return osDto;
                }))
                .collect(Collectors.toList());

        // Call service to check/add staff occupancy
        occupiedStaffService.addOccupiedStaff(occupiedStaffDtos);

        return timeTableMapper.toDto(updatedTT);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        TimeTable tt = timeTableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Timetable not found"));

        // Delete occupied venue rows first
        occupiedVenueRepository.deleteByTimeTableId(id);
        // Delete occupied staff rows as well
        occupiedStaffRepository.deleteByTimeTableId(id);

        timeTableRepository.delete(tt);
    }

    @Override
    public List<TimeTableResponseDto> getByYearAndDegree(Degree degree, Years year, Long academicCalendarId) {
        List<TimeTable> timeTables = timeTableRepository.findByYearAndDegreeAndAcademicCalendarWithDetails(degree, year,
                academicCalendarId);

        return timeTables.stream()
                .map(timeTableMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TimeTableResponseDto> getByDay(String day, Long academicCalendarId) {
        List<TimeTable> timeTables = timeTableRepository.findByDayIgnoreCaseAndAcademicCalendar_Id(day,
                academicCalendarId);
        return timeTables.stream()
                .map(timeTableMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TimeTableResponseDto> getByYearAndDegreeApproved(Degree degree, Years year, Long academicCalendarId) {
        List<TimeTable> timeTables = timeTableRepository.findByYearAndDegreeAndAcademicCalendarWithDetails(degree, year,
                academicCalendarId);

        // Check if timetable approval is done for this academic calendar
        if (!timeTableApprovalService.hasApprovedDecision(academicCalendarId)) {
            return List.of(); // return empty list if no approved decision
        }

        return timeTables.stream()
                .map(timeTableMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public long countSessionsToday(Long academicCalendarId) {
        String today = LocalDate.now().getDayOfWeek().name(); // e.g. "MONDAY"
        return timeTableRepository.countByDayAndAcademicCalendar_Id(today, academicCalendarId);
    }

}