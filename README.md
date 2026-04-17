# GitHub-Like File Sharing Website

A modern, clean file-sharing website with an abstract gradient background (dark purple, blue, black) and smooth animations. Only you can add/remove files by editing the code.

## Features

✨ **Modern Design**
- Abstract gradient background with smooth animations
- Montserrat font for clean, contemporary look
- Smooth hover effects and transitions
- Responsive design (works on all screen sizes)

📥 **File Management**
- Display files with custom icons, sizes, and descriptions
- One-click download functionality
- File counter in header

⚡ **Performance**
- Lightweight and fast-loading
- Backdrop blur effects for modern aesthetic
- Optimized animations

## File Structure

```
github-like-site/
├── index.html          # Main HTML structure
├── styles.css          # All styling, animations, and gradients
├── script.js           # JavaScript functionality (don't edit)
├── files.js            # YOUR FILES — Edit this to add/remove files
└── README.md           # This file
```

## How to Use

### 1. Opening the Website
Simply open `index.html` in your web browser. Or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (with http-server installed)
http-server

# Using Node.js built-in server
npx http-server
```

Then visit `http://localhost:8000`

### 2. Adding/Removing Files

Edit the `files.js` file. Find the `files` array and add or remove file objects:

```javascript
const files = [
    {
        name: "My Document.pdf",
        icon: "📄",
        size: "2.5 MB",
        description: "Important project document",
        url: "https://example.com/doc.pdf"
    },
    // Add more files here...
];
```

**File Object Properties:**
- `name` - The display name of the file
- `icon` - Any emoji or Unicode character
- `size` - File size as a string (e.g., "10 MB")
- `description` - Brief description of the file
- `url` - Full URL/link to download the file

### 3. Customization

**Change Colors/Gradient:**
Edit the `.gradient-bg` background in `styles.css`:
```css
background: linear-gradient(135deg, #0a0a15 0%, #1a0a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%);
```

**Change Font:**
The font is loaded from Google Fonts. To change it, modify the `<link>` tag in `index.html`.

**Adjust Button Colors:**
Look for `.download-btn` background gradient in `styles.css`:
```css
background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%);
```

## Customization Guide

### Icons (Emoji)
You can use any emoji or Unicode character:
- 📄 Document
- 🗂️ Folder/Archive
- 🎨 Design/Image
- 🎥 Video
- ⚙️ Settings/Config
- 💾 Database
- 📦 Package
- 🔐 Security
- 📊 Data
- 🎵 Audio

### Download Links
The `url` field in files.js can be:
- Direct file URL: `https://example.com/file.pdf`
- Cloud storage: `https://drive.google.com/file/d/...`
- Your own server: `/downloads/file.pdf`

## Features Included

✅ **Smooth Animations**
- Gradient background animation
- Card fade-in animations with staggered delays
- Hover effects with ripple animation
- Button click effects

✅ **Clean Button Effects**
- Ripple effect on click
- Smooth color transition
- Lift effect on hover
- Active state feedback

✅ **Effects & Polish**
- Glassmorphism (backdrop blur)
- Subtle glow effects
- Smooth scrollbar styling
- Responsive grid layout

✅ **Accessibility**
- Proper semantic HTML
- Color contrast compliance
- Keyboard navigation support
- Fast loading times

## Tips

💡 **For Best Results:**
1. Use emoji icons for visual appeal
2. Keep descriptions concise (1-2 lines)
3. Update file sizes and descriptions when files change
4. Test links before publishing
5. Use HTTPS for all file URLs for security

🔒 **Security Note:**
- Only edit `files.js` to control content
- HTML and CSS are static and safe
- Always validate external file URLs
- Consider hosting files on a trusted server

## Browser Support

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

Feel free to customize and use this for any purpose!

---

**Made with ❤️ — Enjoy sharing files!**
