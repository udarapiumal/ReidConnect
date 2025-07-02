package reidConnect.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterUserDto {
    private String email;
    private String password;
    private String username;

    private String contactNumber;
    private String academicYear;
    private int age;
}
