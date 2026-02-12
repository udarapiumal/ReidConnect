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
import reidConnect.backend.exception.ResourceNotFoundException;
import reidConnect.backend.mapper.TimeTableApprovalMapper;
import reidConnect.backend.repository.AcademicCalendarRepository;
import reidConnect.backend.repository.TimeTableApprovalRepository;
import reidConnect.backend.repository.UserRepository;
import reidConnect.backend.service.TimeTableApprovalService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TimeTableApprovalServiceImpl implements TimeTableApprovalService {

    private final TimeTableApprovalRepository approvalRepository;
    private final UserRepository userRepository;
    private final AcademicCalendarRepository academicCalendarRepository;

    @Override
    public TimeTableApprovalResponseDto approveTimeTable(TimeTableApprovalRequestDto requestDto) {
        User reviewer = userRepository.findById(requestDto.getReviewerId())
                .orElseThrow(() -> new RuntimeException("Reviewer not found"));

        AcademicCalendar academicCalendar = academicCalendarRepository.findById(requestDto.getAcademicCalendarId())
                .orElseThrow(() -> new ResourceNotFoundException("Academic Calendar not found"));

        TimeTableApproval entity = TimeTableApprovalMapper.toEntity(requestDto, reviewer, academicCalendar);
        TimeTableApproval saved = approvalRepository.save(entity);

        return TimeTableApprovalMapper.toDto(saved);
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
        return approvalRepository.findByAcademicCalendar_Id(academicCalendarId).stream()
                .anyMatch(a -> a.getDecision() == TimeTableApprovalDecision.APPROVED);
    }

}
