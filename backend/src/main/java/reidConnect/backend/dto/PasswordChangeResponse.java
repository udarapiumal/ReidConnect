package reidConnect.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordChangeResponse {
    private boolean success;
    private String message;
    
    public static PasswordChangeResponse success(String message) {
        return new PasswordChangeResponse(true, message);
    }
    
    public static PasswordChangeResponse error(String message) {
        return new PasswordChangeResponse(false, message);
    }
}
