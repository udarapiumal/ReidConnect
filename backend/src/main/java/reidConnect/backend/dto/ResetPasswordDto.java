// ResetPasswordDto.java
package reidConnect.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordDto {
    private String token;
    private String newPassword;
}