package reidConnect.backend.dto.student;
import lombok.Data;

@Data
public class StudentUpdateRequest {
    private String username;
    private String studentName;
    private String profilePictureUrl;
    private String contactNumber;
    private String academicYear;
}
