package reidConnect.backend.exception;

/**
 * Exception thrown when user account is not verified
 */
public class AccountNotVerifiedException extends RuntimeException {
    
    public AccountNotVerifiedException(String message) {
        super(message);
    }
    
    public AccountNotVerifiedException(String message, Throwable cause) {
        super(message, cause);
    }
}
