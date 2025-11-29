package reidConnect.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import reidConnect.backend.enums.Academic_Admin_Role;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterAcademicAdminDto {
    private String username;
    private String email;
    private String password;
    private Long userId;
    private Academic_Admin_Role role;
}

