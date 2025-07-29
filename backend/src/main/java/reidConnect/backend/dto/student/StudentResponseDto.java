package reidConnect.backend.dto.student;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentResponseDto {
    private Long id;
    private String studentName;
    private String academicYear;
    private String contactNumber;
    private String profilePictureUrl;
    private Long userId;
    private String username;
    private String email;
    private String role;
}
