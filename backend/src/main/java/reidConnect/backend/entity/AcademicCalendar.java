package reidConnect.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import reidConnect.backend.enums.PeriodType;

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

    @Enumerated(EnumType.STRING)
    private PeriodType periodType; // SEMESTER, STUDY_LEAVE, VACATION, EXAMINATION, ORIENTATION, etc.
}
