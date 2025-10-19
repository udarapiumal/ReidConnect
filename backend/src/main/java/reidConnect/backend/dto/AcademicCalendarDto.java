package reidConnect.backend.dto;

import lombok.*;
import reidConnect.backend.enums.PeriodType;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AcademicCalendarDto {
    private Long id;
    private String title;
    private LocalDate startDate;
    private LocalDate endDate;
    private String academicYear;
    private String intake;
    private PeriodType periodType;
}
