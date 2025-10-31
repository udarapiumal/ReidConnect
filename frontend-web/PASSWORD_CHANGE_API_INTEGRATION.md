# Password Change API Integration

## Overview
The UserProfile component has been updated to integrate with the backend API for password changes. It now calls the `/api/users/change-password` endpoint when users attempt to change their password.

## API Endpoint
```
PUT /api/users/change-password
```

## Request Payload
```json
{
  "oldPassword": "currentPassword123",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Invalid current password or password requirements not met"
}
```

## Implementation Details

### Changes Made to UserProfile.jsx

#### 1. **Added Axios Import**
```jsx
import axios from '../../api/axiosInstance';
```

#### 2. **Added State Variables**
```jsx
const [isSubmitting, setIsSubmitting] = useState(false);
const [successMessage, setSuccessMessage] = useState('');
const [errorMessage, setErrorMessage] = useState('');
```

#### 3. **Updated handlePasswordSubmit Function**
The function now:
- Makes an async API call to the backend
- Shows loading state during submission
- Displays success message on successful password change
- Displays error messages for various failure scenarios
- Auto-closes modal after 2 seconds on success
- Properly handles all error cases (400, 401, network errors)

```jsx
const handlePasswordSubmit = async (e) => {
  e.preventDefault();
  
  if (!validatePasswordForm()) {
    return;
  }

  setIsSubmitting(true);
  setErrorMessage('');
  setSuccessMessage('');

  try {
    const response = await axios.put('/api/users/change-password', {
      oldPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
      confirmPassword: passwordData.confirmPassword
    });

    if (response.data.success) {
      setSuccessMessage(response.data.message || 'Password changed successfully!');
      setTimeout(() => {
        // Close modal and reset form after 2 seconds
        setPasswordModalOpen(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setErrors({});
        setSuccessMessage('');
      }, 2000);
    }
  } catch (error) {
    // Handle various error scenarios
    if (error.response?.data?.message) {
      setErrorMessage(error.response.data.message);
    } else if (error.response?.status === 400) {
      setErrorMessage('Invalid current password or password requirements not met');
    } else if (error.response?.status === 401) {
      setErrorMessage('Session expired. Please login again');
    } else {
      setErrorMessage('Failed to change password. Please try again later');
    }
  } finally {
    setIsSubmitting(false);
  }
};
```

#### 4. **Added Modal Close Handler**
```jsx
const handleClosePasswordModal = () => {
  setPasswordModalOpen(false);
  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  setErrors({});
  setSuccessMessage('');
  setErrorMessage('');
};
```

#### 5. **Updated UI Elements**

##### Success/Error Messages Display
```jsx
{/* Success Message */}
{successMessage && (
  <div className="alert alert-success">
    <i className="fa fa-check-circle"></i>
    {successMessage}
  </div>
)}

{/* Error Message */}
{errorMessage && (
  <div className="alert alert-error">
    <i className="fa fa-exclamation-circle"></i>
    {errorMessage}
  </div>
)}
```

##### Submit Button with Loading State
```jsx
<button 
  type="submit" 
  className="save-btn full-width"
  disabled={isSubmitting}
>
  {isSubmitting ? (
    <>
      <i className="fa fa-spinner fa-spin"></i>
      Updating...
    </>
  ) : (
    <>
      <i className="fa fa-lock"></i>
      Update Password
    </>
  )}
</button>
```

#### 6. **Added CSS Styles**
```css
/* Alert Messages */
.alert {
  padding: 12px 16px;
  border-radius: 10px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  animation: slideDown 0.3s ease-out;
}

.alert-success {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.alert-error {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

/* Disabled Button States */
.save-btn:disabled {
  background: #4b5563;
  cursor: not-allowed;
  opacity: 0.6;
}

.cancel-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
```

## Features

### ✅ Form Validation
- Current password required
- New password minimum 8 characters
- Password confirmation must match
- Client-side validation before API call

### ✅ Loading States
- Submit button shows spinner during API call
- Submit button disabled during submission
- Cancel button disabled during submission
- Prevents multiple simultaneous submissions

### ✅ Success Handling
- Green success message displayed
- Modal auto-closes after 2 seconds
- Form fields cleared
- Success icon animation

### ✅ Error Handling
- Red error message displayed
- Specific error messages for different scenarios:
  - Invalid current password
  - Session expired (401)
  - Validation errors (400)
  - Network/server errors
- Error message stays visible until user dismisses
- Allows user to retry

### ✅ Security
- Uses JWT token from localStorage (via axiosInstance)
- Token automatically attached to Authorization header
- Secure password transmission via HTTPS
- Passwords masked by default with toggle visibility

### ✅ User Experience
- Smooth animations for alerts
- Clear visual feedback
- Intuitive button states
- Auto-dismissal on success
- Modal persists on error for retry

## Backend Integration

The component expects the backend to:

1. **Validate the JWT token** from the Authorization header
2. **Extract the current user** from the security context
3. **Verify the old password** matches the user's current password
4. **Validate the new password** meets requirements
5. **Update the password** in the database
6. **Return appropriate response** (success or error with message)

### Backend Expected Behavior

```java
@PutMapping("/change-password")
public ResponseEntity<PasswordChangeResponse> changePassword(@RequestBody PasswordChangeRequest request) {
    try {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        
        userService.changePassword(currentUser.getEmail(), request);
        return ResponseEntity.ok(PasswordChangeResponse.success("Password changed successfully"));
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(PasswordChangeResponse.error(e.getMessage()));
    }
}
```

## Testing Checklist

- [ ] Test with correct current password
- [ ] Test with incorrect current password
- [ ] Test with password less than 8 characters
- [ ] Test with non-matching confirmation password
- [ ] Test with expired/invalid JWT token
- [ ] Test network error scenarios
- [ ] Verify loading states appear correctly
- [ ] Verify success message and auto-close
- [ ] Verify error messages display correctly
- [ ] Verify form reset on success
- [ ] Verify form persists on error for retry
- [ ] Test canceling during submission
- [ ] Test multiple rapid submissions (should be prevented)

## Error Messages

| Scenario | Message |
|----------|---------|
| Success | "Password changed successfully!" |
| Invalid current password | "Invalid current password or password requirements not met" |
| Session expired | "Session expired. Please login again" |
| Network error | "Failed to change password. Please try again later" |
| Server error | Error message from backend response |

## Notes

- The JWT token is automatically included via `axiosInstance`
- The base URL is configured in `axiosInstance.js` as `http://localhost:8080`
- Update the base URL for production deployment
- Password visibility toggles remain functional during submission
- Form validation runs before API call to reduce unnecessary requests

## Next Steps (Optional Enhancements)

- [ ] Add password strength indicator
- [ ] Add password history check (prevent reusing recent passwords)
- [ ] Add email notification on password change
- [ ] Add "Forgot Password" functionality
- [ ] Add 2FA/MFA support
- [ ] Add password expiry warnings
- [ ] Log password change events for security audit
