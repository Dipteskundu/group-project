# Image Upload Feature - Projects & Certificates

## Summary
Successfully implemented ImgBB API image upload functionality for project screenshots and certificate images in the Edit Profile page.

## Features Implemented

### 1. Project Screenshot Upload
Users can now upload project screenshots with the following features:

**Upload Methods:**
- Click "Upload Screenshot" button to select file from device
- Paste image URL directly into input field
- Drag and drop support (via file input)

**Features:**
- ✅ Image preview with hover overlay
- ✅ Remove image button (appears on hover)
- ✅ Change screenshot option when image exists
- ✅ Real-time upload with loading state
- ✅ Success/error notifications
- ✅ File validation (JPG, PNG, WEBP, max 5MB)
- ✅ Automatic URL update after upload

### 2. Certificate Image Upload
Same functionality for certificate images:

**Upload Methods:**
- Click "Upload Certificate" button
- Paste certificate image URL
- File selection from device

**Features:**
- ✅ Image preview with remove option
- ✅ Loading state during upload
- ✅ Success/error feedback
- ✅ File type and size validation
- ✅ URL input as alternative

## Technical Implementation

### ImgBB API Integration
- Uses existing `uploadToImgBB` utility from `lib/imageUpload.js`
- API key from environment variable: `NEXT_PUBLIC_IMGBB_API_KEY`
- Validates file type and size before upload
- Returns uploaded image URL

### UI/UX Features

**Image Preview:**
```jsx
- Full-width preview (h-48)
- Rounded corners with border
- Hover overlay with remove button
- Object-cover for proper aspect ratio
```

**Upload Button:**
```jsx
- Dashed border design
- Camera icon
- Dynamic text (Upload/Change/Uploading...)
- Hover effects (indigo accent)
```

**Dual Input Method:**
```jsx
- File upload button (primary)
- URL input field (alternative)
- Switches based on image state
```

### State Management
- Uses existing `uploading` state
- Updates `error` and `success` states
- Clears file input after upload
- Auto-dismisses success message (3s)

## User Flow

### For Projects:
1. Click "Add Project" button
2. Fill in project details
3. Click "Upload Screenshot" or paste URL
4. Image uploads to ImgBB
5. Preview appears with remove option
6. Can change image anytime
7. Save profile to persist

### For Certificates:
1. Click "Add Certificate" button
2. Fill in certificate details
3. Click "Upload Certificate" or paste URL
4. Image uploads to ImgBB
5. Preview shows certificate image
6. Can remove or change image
7. Save profile to persist

## File Validation

**Accepted Formats:**
- image/jpeg
- image/png
- image/webp

**Size Limit:**
- Maximum 5MB per image

**Error Handling:**
- Invalid file type → Error message
- File too large → Error message
- Network error → Error message
- Upload failure → Error message

## Benefits

✅ **User-Friendly**: Simple click-to-upload interface
✅ **Flexible**: Upload file OR paste URL
✅ **Visual Feedback**: Image preview before saving
✅ **Professional**: Clean, modern UI design
✅ **Reliable**: ImgBB CDN hosting
✅ **Fast**: Instant upload with progress indication
✅ **Validated**: File type and size checks
✅ **Accessible**: Clear labels and feedback

## Testing Checklist

- [x] Upload project screenshot via file
- [x] Upload project screenshot via URL
- [x] Remove project screenshot
- [x] Change project screenshot
- [x] Upload certificate image via file
- [x] Upload certificate image via URL
- [x] Remove certificate image
- [x] Change certificate image
- [x] File validation (type)
- [x] File validation (size)
- [x] Loading state display
- [x] Success message display
- [x] Error message display
- [x] Image preview display
- [x] Save and persist images

## Environment Setup

Ensure `.env.local` contains:
```
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key_here
```

Get your API key from: https://api.imgbb.com/

---

**Status**: Complete ✅
**Date**: March 9, 2026
**Files Modified**: `SkillMatch-AI/src/app/profile/edit/page.jsx`
