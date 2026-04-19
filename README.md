# GitHub-Like File Repository Site

A modern, secure file sharing platform with PIN authentication, nested authentication layers, and a secret vault. All files are shared in real-time across users using Firebase Firestore.

## 🌟 Features

### Main Page (`/`)
- 🔐 **PIN Authentication** - Secure access with 5-digit PIN (default: `12345`)
- 📁 **File Grid** - Beautiful card-based file display with icons
- ⬇️ **Download Files** - Direct download links for each file
- ➕ **Add Files** - Modal form to upload new files with:
  - File name, description, size selector
  - Download link
  - Custom icon image upload with preview
- 🎨 **Glassmorphic Design** - Modern UI with gradients and blur effects
- 📱 **Fully Responsive** - Works perfectly on mobile, tablet, and desktop

### Authentication Layers
- **Level 1**: PIN code (12345)
- **Level 2**: First password (hartmann69420)
- **Level 3**: Second password (idhensk8473hhejsi) → Redirects to `/secret`

### Secret Vault (`/secret`)
- Same file management features as main page
- Separate file storage using Firebase
- No authentication bars (clean interface)
- All files shared between secret vault users
- Real-time file synchronization

### Real-Time Features
- ✅ Files shared across ALL users
- ✅ Real-time updates with Firebase Firestore
- ✅ No page refresh needed to see new files
- ✅ Instant deletion across all users
- ✅ Persistent storage across sessions

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Firebase Firestore (Cloud Database)
- **Hosting**: Vercel (Serverless)
- **Authentication**: Client-side PIN + custom codes

## 📋 Files Structure

```
.
├── index.html                 # Main page
├── secret.html               # Secret vault page
├── script.js                 # Main page logic (Firebase)
├── secret-script.js          # Secret page logic (Firebase)
├── files.js                  # Static files array
├── styles.css                # Shared styles
├── firebase-config.js        # Firebase configuration
├── FIREBASE_SETUP.md         # Firebase setup guide
├── DEPLOYMENT_GUIDE.md       # Deployment instructions
└── README.md                 # This file
```

## 🚀 Quick Start

### 1. Setup Firebase
See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for detailed Firebase configuration

### 2. Update firebase-config.js
Replace with your Firebase credentials from Firebase Console

### 3. Test Locally
```bash
cd /workspaces/github-like-site
# Test with any local HTTP server
python3 -m http.server 8000
# Or use any other server
```

### 4. Deploy to Vercel
See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for step-by-step instructions

## 🔐 Default Credentials

| Page | Credential | Type |
|------|-----------|------|
| Main | `12345` | PIN |
| Step 1 | `hartmann69420` | Password |
| Step 2 | `idhensk8473hhejsi` | Secret Code |

⚠️ **Change these in production!**

## 📝 Usage

### Adding Files (Main Page)
1. Enter PIN `12345`
2. Click "+ Add File" button
3. Fill form with:
   - File name
   - Description
   - File size (number + unit: KB/MB/GB)
   - Download link
   - Icon image (drag & drop or click)
4. Click "Add File"
5. File appears instantly for all users

### Accessing Secret Vault
1. Enter PIN `12345`
2. Scroll to bottom
3. Enter password: `hartmann69420` (Shows "✓ Correct")
4. Enter secret code: `idhensk8473hhejsi`
5. Redirected to `/secret` page
6. Enter PIN again to access secret files

### Deleting Files
- Click trash icon (🗑️) on any file card
- Confirm deletion
- File removed instantly for all users

## 🎨 Design Highlights

- **Glassmorphic UI**: Frosted glass effect with backdrop blur
- **Purple/Blue Gradient**: Primary color scheme
- **Smooth Animations**: All interactions have polished transitions
- **Responsive Layout**: Works on all screen sizes
- **Dark Theme**: Eye-friendly dark background

## 🔒 Security Notes

Currently, security is client-side only:
- PINs are visible in source code
- Credentials are hardcoded
- Not suitable for sensitive data

For production:
- Implement server-side authentication
- Use environment variables for secrets
- Add proper access controls
- Encrypt sensitive data

## 🐛 Troubleshooting

### Files not appearing?
- Check Firebase is initialized (Console → No red errors)
- Verify Firestore collections exist
- Check network tab in browser DevTools

### Authentication not working?
- Check browser console for JavaScript errors
- Verify credentials exactly (case-sensitive)
- Clear browser cache and refresh

### Secret page not loading?
- Ensure `vercel.json` has `/secret` rewrite rule
- Check `secret.html` exists in root
- Redeploy to Vercel

## 📚 Documentation

- [Firebase Setup](FIREBASE_SETUP.md) - Complete Firebase configuration
- [Deployment Guide](DEPLOYMENT_GUIDE.md) - GitHub & Vercel deployment
- [Security Notes](#-security-notes) - Security considerations

## 🎓 Learn More

- [Firebase Firestore Docs](https://firebase.google.com/docs/firestore)
- [Vercel Docs](https://vercel.com/docs)
- [CSS Backdrop Filter](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to fork, modify, and improve this project!

---

**Made with ❤️ - Enjoy your file sharing platform!** 🚀
