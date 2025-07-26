package reidConnect.backend.dto.staff;

import lombok.Data;
import reidConnect.backend.enums.Faculties;
import reidConnect.backend.enums.AcademicRank;

@Data
public class StaffRequestDto {
    private String name;
    private String code;
    private Faculties faculty;
    private AcademicRank rank;
    private String email;
    private String degree;
}
