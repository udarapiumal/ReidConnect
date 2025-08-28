package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reidConnect.backend.entity.TimeTableApproval;
import reidConnect.backend.enums.TimeTableType;

import java.util.Arrays;
import java.util.List;

public interface TimeTableApprovalRepository extends JpaRepository<TimeTableApproval, Long> {
    List<TimeTableApproval> findByType(TimeTableType type);  // use TimeTableType, not Decision
    List<TimeTableApproval> findByTypeOrderByReviewedAtDesc(TimeTableType type);

}
