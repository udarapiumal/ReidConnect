package reidConnect.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reidConnect.backend.dto.timetable.TimeTableApprovalRequestDto;
import reidConnect.backend.dto.timetable.TimeTableApprovalResponseDto;
import reidConnect.backend.entity.TimeTableApproval;
import reidConnect.backend.entity.User;
import reidConnect.backend.enums.TimeTableApprovalDecision;
import reidConnect.backend.enums.TimeTableType;
import reidConnect.backend.mapper.TimeTableApprovalMapper;
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

    @Override
    public TimeTableApprovalResponseDto approveTimeTable(TimeTableApprovalRequestDto requestDto) {
        User reviewer = userRepository.findById(requestDto.getReviewerId())
                .orElseThrow(() -> new RuntimeException("Reviewer not found"));

        TimeTableApproval entity = TimeTableApprovalMapper.toEntity(requestDto, reviewer);
        TimeTableApproval saved = approvalRepository.save(entity);

        return TimeTableApprovalMapper.toDto(saved);
    }

    @Override
    public List<TimeTableApprovalResponseDto> getApprovalsByType(String type) {
        TimeTableType ttType = TimeTableType.valueOf(type.toUpperCase()); // parse type
        return approvalRepository.findByType(ttType)
                .stream()
                .map(TimeTableApprovalMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public TimeTableApprovalResponseDto getLatestDecision(String type, String role) {
        return approvalRepository.findByTypeOrderByReviewedAtDesc(TimeTableType.valueOf(type)).stream()
                .filter(a -> a.getRole().equals(role))
                .findFirst()
                .map(TimeTableApprovalMapper::toDto)
                .orElse(null);
    }

    //return if there is APPROVED in the decision column
    @Override
    public boolean hasApprovedDecision() {
        return approvalRepository.findByType(TimeTableType.ACADEMIC_TIME_TABLE).stream()
                .anyMatch(a -> a.getDecision() == TimeTableApprovalDecision.APPROVED);
    }


}
