package reidConnect.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import reidConnect.backend.enums.PeriodType;
import reidConnect.backend.enums.TimetableStatus;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AcademicCalendar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title; // e.g., "Second Semester", "Study Leave", "Christmas Vacation"

    private LocalDate startDate;
    private LocalDate endDate;

    private String academicYear; // e.g., "2025/2026"
    private String intake; // e.g., "20/21", "21/22"

    @Enumerated(EnumType.STRING)
    private PeriodType periodType; // SEMESTER, STUDY_LEAVE, VACATION, EXAMINATION, ORIENTATION, etc.

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TimetableStatus timetableStatus = TimetableStatus.DRAFT;
}
