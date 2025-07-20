package reidConnect.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterClubDto {
    private Long id;
    private String username;
    private String email;
    private String clubName;
    private Long userId;
    private String website;
    private String profilePicture;
    private String coverPicture;
    private String bio;
}
