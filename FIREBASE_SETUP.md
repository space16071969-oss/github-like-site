# Firebase Setup Guide

This project uses Firebase (Firestore) to share files between all users. Follow these steps to set up Firebase:

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter your project name (e.g., "github-like-site")
4. Follow the setup steps

## Step 2: Enable Firestore Database

1. In the Firebase Console, go to **Build → Firestore Database**
2. Click **"Create Database"**
3. Choose **"Start in production mode"**
4. Select your region (closest to your users)
5. Click **"Enable"**

## Step 3: Get Your Firebase Credentials

1. Go to **Project Settings** (gear icon)
2. Scroll to **"Your apps"** section
3. Click the **Web** icon (</> symbol)
4. Copy the firebaseConfig object from the code shown

## Step 4: Update firebase-config.js

1. Open `firebase-config.js` in your project
2. Replace the credentials with your own:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

## Step 5: Set Firestore Security Rules

1. Go to **Firestore Database → Rules** in Firebase Console
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /public_files/{document=**} {
      allow read: if true;
      allow create, write, delete: if true;
    }
    match /secret_files/{document=**} {
      allow read: if true;
      allow create, write, delete: if true;
    }
  }
}
```

3. Click **"Publish"**

## Step 6: Deploy to Vercel

1. Push your changes to GitHub:
```bash
git add .
git commit -m "Add Firebase backend for shared files"
git push
```

2. Vercel will automatically redeploy your site with the new Firebase integration

## Features After Setup

✅ **All users see the same files** when they upload
✅ **Real-time updates** - Files appear instantly for everyone
✅ **Persistent storage** - Files survive across refreshes
✅ **Shared secret vault** - Secret files accessible from `/secret` page
✅ **Delete functionality** - Remove files you've uploaded

## Troubleshooting

**Files not showing up?**
- Check Firebase Console → Firestore Database to see if collections are created
- Verify `public_files` and `secret_files` collections exist
- Check browser console (F12) for any error messages

**Permission denied errors?**
- Make sure Firestore Rules are set to allow read/write
- Check that Firebase credentials in `firebase-config.js` are correct

**Firebase not loading?**
- Check your internet connection
- Verify `firebase-config.js` is correctly configured
- Open browser console (F12) → Network tab to check Firebase CDN requests

## Testing

1. Open the site in multiple browser windows/tabs
2. Upload a file in one window
3. The file should appear instantly in other windows
4. Test the secret vault too at `/secret`

All files are now shared across users! 🎉
