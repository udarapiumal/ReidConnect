package reidConnect.backend.dto.staff;
import lombok.Data;

@Data
public class OccupiedStaffDto {
    private Long staffId;
    private String day;
    private Long slotId;
    private Long timeTableId;
}
