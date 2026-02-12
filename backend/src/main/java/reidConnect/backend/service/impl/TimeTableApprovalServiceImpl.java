package reidConnect.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reidConnect.backend.dto.timetable.TimeTableApprovalRequestDto;
import reidConnect.backend.dto.timetable.TimeTableApprovalResponseDto;
import reidConnect.backend.entity.AcademicCalendar;
import reidConnect.backend.entity.TimeTableApproval;
import reidConnect.backend.entity.User;
import reidConnect.backend.enums.TimeTableApprovalDecision;
import reidConnect.backend.enums.TimetableStatus;
import reidConnect.backend.exception.ResourceNotFoundException;
import reidConnect.backend.mapper.TimeTableApprovalMapper;
import reidConnect.backend.repository.AcademicCalendarRepository;
import reidConnect.backend.repository.TimeTableApprovalRepository;
import reidConnect.backend.repository.UserRepository;
import reidConnect.backend.service.TimeTableApprovalService;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TimeTableApprovalServiceImpl implements TimeTableApprovalService {

    private final TimeTableApprovalRepository approvalRepository;
    private final UserRepository userRepository;
    private final AcademicCalendarRepository academicCalendarRepository;

    // Valid transitions: decision → set of allowed current statuses
    private static final Set<TimetableStatus> EDITABLE_STATUSES = Set.of(
            TimetableStatus.DRAFT,
            TimetableStatus.NOT_RECOMMENDED,
            TimetableStatus.REJECTED);

    @Override
    public TimeTableApprovalResponseDto approveTimeTable(TimeTableApprovalRequestDto requestDto) {
        User reviewer = userRepository.findById(requestDto.getReviewerId())
                .orElseThrow(() -> new RuntimeException("Reviewer not found"));

        AcademicCalendar calendar = academicCalendarRepository.findById(requestDto.getAcademicCalendarId())
                .orElseThrow(() -> new ResourceNotFoundException("Academic Calendar not found"));

        TimetableStatus currentStatus = calendar.getTimetableStatus();
        TimeTableApprovalDecision decision = requestDto.getDecision();

        // Validate and compute the next status
        TimetableStatus nextStatus = validateAndGetNextStatus(currentStatus, decision);

        // Save the audit record
        TimeTableApproval entity = TimeTableApprovalMapper.toEntity(requestDto, reviewer, calendar);
        TimeTableApproval saved = approvalRepository.save(entity);

        // Transition the FSM
        calendar.setTimetableStatus(nextStatus);
        academicCalendarRepository.save(calendar);

        return TimeTableApprovalMapper.toDto(saved);
    }

    /**
     * FSM transition table:
     * PENDING : allowed from DRAFT, NOT_RECOMMENDED, REJECTED →
     * PENDING_RECOMMENDATION
     * RECOMMENDED : allowed from PENDING_RECOMMENDATION → RECOMMENDED
     * NOT_RECOMMENDED : allowed from PENDING_RECOMMENDATION → NOT_RECOMMENDED
     * APPROVED : allowed from RECOMMENDED → APPROVED
     * REJECTED : allowed from RECOMMENDED → REJECTED
     */
    private TimetableStatus validateAndGetNextStatus(TimetableStatus current, TimeTableApprovalDecision decision) {
        return switch (decision) {
            case PENDING -> {
                if (!EDITABLE_STATUSES.contains(current)) {
                    throw new IllegalStateException(
                            "Cannot send for recommendation: timetable status is " + current);
                }
                yield TimetableStatus.PENDING_RECOMMENDATION;
            }
            case RECOMMENDED -> {
                if (current != TimetableStatus.PENDING_RECOMMENDATION) {
                    throw new IllegalStateException(
                            "Cannot recommend: timetable status is " + current + ", expected PENDING_RECOMMENDATION");
                }
                yield TimetableStatus.RECOMMENDED;
            }
            case NOT_RECOMMENDED -> {
                if (current != TimetableStatus.PENDING_RECOMMENDATION) {
                    throw new IllegalStateException(
                            "Cannot mark as not recommended: timetable status is " + current);
                }
                yield TimetableStatus.NOT_RECOMMENDED;
            }
            case APPROVED -> {
                if (current != TimetableStatus.RECOMMENDED) {
                    throw new IllegalStateException(
                            "Cannot approve: timetable status is " + current + ", expected RECOMMENDED");
                }
                yield TimetableStatus.APPROVED;
            }
            case REJECTED -> {
                if (current != TimetableStatus.RECOMMENDED) {
                    throw new IllegalStateException(
                            "Cannot reject: timetable status is " + current + ", expected RECOMMENDED");
                }
                yield TimetableStatus.REJECTED;
            }
        };
    }

    @Override
    public List<TimeTableApprovalResponseDto> getApprovalsByAcademicCalendar(Long academicCalendarId) {
        return approvalRepository.findByAcademicCalendar_Id(academicCalendarId)
                .stream()
                .map(TimeTableApprovalMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public TimeTableApprovalResponseDto getLatestDecision(Long academicCalendarId, String role) {
        return approvalRepository.findByAcademicCalendar_IdOrderByReviewedAtDesc(academicCalendarId).stream()
                .filter(a -> a.getRole().equals(role))
                .findFirst()
                .map(TimeTableApprovalMapper::toDto)
                .orElse(null);
    }

    @Override
    public boolean hasApprovedDecision(Long academicCalendarId) {
        AcademicCalendar calendar = academicCalendarRepository.findById(academicCalendarId)
                .orElse(null);
        return calendar != null && calendar.getTimetableStatus() == TimetableStatus.APPROVED;
    }

    @Override
    public TimetableStatus getCurrentStatus(Long academicCalendarId) {
        AcademicCalendar calendar = academicCalendarRepository.findById(academicCalendarId)
                .orElseThrow(() -> new ResourceNotFoundException("Academic Calendar not found"));
        return calendar.getTimetableStatus();
    }
}
