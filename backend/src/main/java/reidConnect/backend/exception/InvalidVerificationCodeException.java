package reidConnect.backend.exception;

/**
 * Exception thrown when verification code is invalid or expired
 */
public class InvalidVerificationCodeException extends RuntimeException {
    
    public InvalidVerificationCodeException(String message) {
        super(message);
    }
    
    public InvalidVerificationCodeException(String message, Throwable cause) {
        super(message, cause);
    }
}
