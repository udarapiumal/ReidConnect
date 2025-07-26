package reidConnect.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserWithProfileDto {
    private Long id;
    private String username;
    private String email;
    private String role;
    private String profilePicUrl;

    // Constructors
    public UserWithProfileDto() {}

    public UserWithProfileDto(Long id, String username, String email, String role, String profilePicUrl) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.profilePicUrl = profilePicUrl;
    }
}
