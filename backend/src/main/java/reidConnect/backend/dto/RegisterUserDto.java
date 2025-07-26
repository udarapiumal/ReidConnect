package reidConnect.backend.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class RegisterUserDto {
    private String email;
    private String password;
    private String username;

    private String contactNumber;
    private String academicYear;
    private MultipartFile profilePic;
}
