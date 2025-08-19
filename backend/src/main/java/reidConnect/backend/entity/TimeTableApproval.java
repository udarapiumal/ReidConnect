package reidConnect.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import reidConnect.backend.enums.TimeTableApprovalDecision;
import reidConnect.backend.enums.TimeTableType;

import java.time.LocalDateTime;

@Entity
@Table(name = "timetable_approval")
@Getter
@Setter
public class TimeTableApproval {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TimeTableType type; // e.g. ACADEMIC_TIME_TABLE

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;  // SAR / HOD / etc.

    @Column(nullable = false)
    private String role; // e.g. SAR, HOD

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TimeTableApprovalDecision decision; // RECOMMENDED, NOT_RECOMMENDED, APPROVED, REJECTED

    @Column(columnDefinition = "TEXT")
    private String message;

    private LocalDateTime reviewedAt = LocalDateTime.now();
}
