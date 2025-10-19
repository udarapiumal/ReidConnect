package reidConnect.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserWithProfileDto {
    private Long id;
    private String name;
    private String email;
    private String role;

    // Student fields
    private String profilePicUrl;
    private String academicYear;
    private String contactNumber;
    private int registeredYear;
    private String faculty;
    private String studentName;
}
