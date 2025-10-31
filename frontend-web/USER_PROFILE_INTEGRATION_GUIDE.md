# User Profile Integration Guide

## Overview
The UserProfile page has been integrated into the Academic Admin Portal. Users can now view and edit their profile by clicking the user icon in the header.

## How It Works

### 1. **Accessing the User Profile**
- Click the **user icon** (👤) in the top-right corner of the header
- The profile modal will open with a blur effect on the background
- The modal displays user information including:
  - Profile photo
  - Name
  - Email
  - Phone number
  - Location
  - Bio
  - Join date

### 2. **Features Available**

#### View Profile
- See all your account information
- View account statistics (posts, followers, following)

#### Edit Profile
- Click the "Edit Profile" button
- Update your:
  - Name
  - Email
  - Phone number
  - Location
  - Bio
- Form validation ensures data integrity
- Click "Save Changes" to update or "Cancel" to discard

#### Change Password
- Click the "Change Password" button
- Enter:
  - Current password
  - New password
  - Confirm new password
- Password requirements:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one number
  - New password must match confirmation
- Toggle visibility icons to show/hide passwords

#### Close Profile
- Click the "×" button in the top-right
- Click outside the modal
- Press the "ESC" key
- Background blur effect will be removed

## Implementation Details

### Files Modified

#### 1. **Header.jsx**
```jsx
// Added onProfileClick prop
export default function Header({ onProfileClick }) {
  // User icon now has click handler
  <i 
    className="fas fa-user icon" 
    onClick={onProfileClick}
    style={{ cursor: 'pointer' }}
    title="View Profile"
  ></i>
}
```

#### 2. **Dashboard.jsx**
```jsx
// Added state management
const [showProfile, setShowProfile] = useState(false);

// Pass handler to Header
<Header onProfileClick={() => setShowProfile(true)} />

// Conditional rendering with blur effect
<div className={`dashboard-container ${showProfile ? 'blur-background' : ''}`}>
  
// Render UserProfile modal
{showProfile && (
  <UserProfile onClose={() => setShowProfile(false)} />
)}
```

## Usage in Other Pages

To add the UserProfile to other pages in the academic portal:

### Step 1: Import Required Components
```jsx
import { useState } from 'react';
import UserProfile from './UserProfile';
import Header from './components/Header';
```

### Step 2: Add State Management
```jsx
const [showProfile, setShowProfile] = useState(false);
```

### Step 3: Update Container Class
```jsx
<div className={`your-container ${showProfile ? 'blur-background' : ''}`}>
```

### Step 4: Pass Handler to Header
```jsx
<Header onProfileClick={() => setShowProfile(true)} />
```

### Step 5: Render Profile Modal
```jsx
{showProfile && (
  <UserProfile onClose={() => setShowProfile(false)} />
)}
```

### Step 6: Ensure CSS Support
Make sure your page has the blur-background CSS:
```css
.your-container.blur-background .your-content {
  filter: blur(8px);
  pointer-events: none;
}
```

## Testing

1. **Open User Profile**: Click the user icon in header
2. **Edit Information**: Click "Edit Profile", modify fields, save
3. **Change Password**: Click "Change Password", fill form, submit
4. **Close Modal**: Try all three methods (×, ESC, click outside)
5. **Verify Blur**: Background should blur when modal is open
6. **Check Validation**: Try invalid inputs to test validation

## Current Implementation Status

✅ UserProfile integrated in Dashboard
✅ Click handler on user icon
✅ Background blur effect
✅ Modal open/close functionality
✅ Edit profile feature
✅ Change password feature
✅ Form validation
✅ Responsive design

## Next Steps (Optional Enhancements)

- [ ] Connect to backend API for real user data
- [ ] Add profile picture upload functionality
- [ ] Add email verification
- [ ] Implement actual password change API call
- [ ] Add success/error toast notifications
- [ ] Add loading states during save operations
- [ ] Integrate with other academic portal pages (TimeTable, Events, etc.)

## Notes

- The profile data is currently hardcoded in the component
- Password changes are currently only validated, not sent to backend
- Profile updates are only stored in local state
- Consider adding API integration for persistence
