# Password Change API Documentation

## Overview
This document describes the password change functionality implemented in the ReidConnect backend. The API allows authenticated users to change their passwords after verifying their current password.

## Endpoints

### 1. Change Password (User Controller)
**URL:** `PUT /users/change-password`
**Authentication:** Required (JWT Token)

### 2. Change Password (Student Controller)
**URL:** `PUT /student/change-password`
**Authentication:** Required (JWT Token)

Both endpoints have the same functionality and request/response format.

## Request Format

### Headers
```
Content-Type: application/json
Authorization: Bearer <your-jwt-token>
```

### Request Body
```json
{
    "currentPassword": "your-current-password",
    "newPassword": "your-new-password",
    "confirmPassword": "your-new-password"
}
```

### Field Validation
- `currentPassword`: Required, cannot be empty
- `newPassword`: Required, minimum 8 characters
- `confirmPassword`: Required, must match `newPassword`

## Response Format

### Success Response (200 OK)
```json
{
    "success": true,
    "message": "Password changed successfully"
}
```

### Error Response (400 Bad Request)
```json
{
    "success": false,
    "message": "Error message describing what went wrong"
}
```

## Common Error Messages

1. **"Current password is required"** - The currentPassword field is empty or null
2. **"New password is required"** - The newPassword field is empty or null
3. **"Password confirmation is required"** - The confirmPassword field is empty or null
4. **"New password must be at least 8 characters long"** - The new password is too short
5. **"Current password is incorrect"** - The provided current password doesn't match the user's actual current password
6. **"New password and confirm password do not match"** - The newPassword and confirmPassword fields don't match
7. **"New password must be different from current password"** - The new password is the same as the current password
8. **"User not found"** - The authenticated user was not found in the database

## Example Usage

### Using cURL
```bash
curl -X PUT http://localhost:8080/users/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token-here" \
  -d '{
    "currentPassword": "oldPassword123",
    "newPassword": "newPassword456",
    "confirmPassword": "newPassword456"
  }'
```

### Using JavaScript (Fetch API)
```javascript
const changePassword = async (currentPassword, newPassword, confirmPassword) => {
  try {
    const response = await fetch('/users/change-password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
        confirmPassword
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Password changed successfully');
    } else {
      console.error('Error:', result.message);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};
```

## Implementation Details

### Security Features
1. **Current Password Verification**: Users must provide their current password to change it
2. **Password Encryption**: New passwords are encrypted using BCrypt before saving
3. **Authentication Required**: Only authenticated users can change their passwords
4. **Password Strength**: Minimum 8 characters required for new passwords
5. **Password Confirmation**: Users must confirm their new password to prevent typos

### Backend Flow
1. Extract current user from JWT token
2. Validate request parameters
3. Verify current password matches user's actual password
4. Check that new password and confirmation match
5. Ensure new password is different from current password
6. Encrypt new password using BCrypt
7. Save updated password to database
8. Return success/error response

## Files Modified/Created

### New Files
- `PasswordChangeRequest.java` - DTO for password change request
- `PasswordChangeResponse.java` - DTO for password change response

### Modified Files
- `UserService.java` - Added password change logic
- `UserController.java` - Added password change endpoint
- `StudentController.java` - Added password change endpoint
