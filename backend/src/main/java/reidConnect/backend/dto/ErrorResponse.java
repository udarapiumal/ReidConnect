package reidConnect.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
    private String error;
    private String message;
    private int statusCode;
    private LocalDateTime timestamp;
    private String path;
    
    public ErrorResponse(String error, String message, int statusCode, String path) {
        this.error = error;
        this.message = message;
        this.statusCode = statusCode;
        this.path = path;
        this.timestamp = LocalDateTime.now();
    }
}
