# Student Profile Picture API

## Overview
This document describes the profile picture upload functionality added to the StudentController.

## Endpoints

### 1. Upload Profile Picture
**POST** `/student/me/profile-picture`

Uploads a new profile picture for the currently authenticated student.

**Parameters:**
- `profilePicture` (multipart file) - The image file to upload

**Supported File Types:**
- JPG/JPEG
- PNG
- GIF
- WebP

**Response:**
- Success (200): Returns updated `StudentResponseDto` with new profile picture URL
- Bad Request (400): Invalid file type or empty file
- Not Found (404): Student not found
- Internal Server Error (500): File upload failed

**Example Usage:**
```bash
curl -X POST \
  http://localhost:8080/student/me/profile-picture \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -F 'profilePicture=@/path/to/image.jpg'
```

### 2. Remove Profile Picture
**DELETE** `/student/me/profile-picture`

Removes the profile picture for the currently authenticated student.

**Response:**
- Success (200): Returns updated `StudentResponseDto` with null profile picture URL
- Not Found (404): Student not found
- Internal Server Error (500): Operation failed

**Example Usage:**
```bash
curl -X DELETE \
  http://localhost:8080/student/me/profile-picture \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

### 3. Serve Profile Pictures
**GET** `/student/profile-pictures/{filename}`

Serves uploaded profile picture files.

**Parameters:**
- `filename` - The filename of the profile picture

**Response:**
- Success (200): Returns the image file with appropriate content type
- Not Found (404): File not found

**Example Usage:**
```bash
curl http://localhost:8080/student/profile-pictures/uuid_profile_image.jpg
```

## File Storage
- Profile pictures are stored in `src/main/resources/static/uploads/`
- Files are renamed with UUID prefix to avoid conflicts: `{UUID}_profile_{originalfilename}`
- Files can also be accessed through the existing global endpoint: `/api/posts/uploads/{filename}`

## Security
- All endpoints require authentication
- Only the authenticated student can upload/remove their own profile picture
- File type validation prevents non-image uploads
- File size limits are controlled by Spring Boot multipart configuration (currently 10MB max)

## Database Schema
The `Student` entity includes a `profilePictureUrl` field that stores the relative path to the uploaded image:
```sql
profile_picture_url VARCHAR(255)
```

## Integration Notes
- The profile picture URL is included in `StudentResponseDto`
- The existing student update mechanism also supports profile picture URL updates
- Profile pictures use the same storage and serving mechanism as post media files
