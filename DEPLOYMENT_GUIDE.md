# GitHub & Vercel Deployment Guide

## Push to GitHub

### Step 1: Stage your changes
```bash
cd /workspaces/github-like-site
git add .
```

### Step 2: Commit your changes
```bash
git commit -m "Add PIN auth, file management, secret vault, and Firebase backend"
```

### Step 3: Push to GitHub
```bash
git push origin main
```

## Deploy to Vercel

### Option 1: Automatic Deployment (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Vercel will detect it's a static site
5. Click **"Deploy"**

Vercel will automatically redeploy whenever you push to GitHub!

### Option 2: Manual Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts

## Configure for `/secret` Endpoint

### If using Vercel:

Create `vercel.json` in your project root:

```json
{
  "rewrites": [
    {
      "source": "/secret",
      "destination": "/secret.html"
    }
  ]
}
```

Then push this file to GitHub and Vercel will auto-redeploy.

## Post-Deployment Setup

### 1. Update Firebase Config

Even though Firebase is configured locally, you may want to add environment variables to Vercel:

1. Go to Vercel project settings
2. Go to **Environment Variables**
3. Add any sensitive configs if needed (optional for public Firebase configs)

### 2. Test Your Site

1. Visit your Vercel deployment URL
2. Enter PIN: `12345`
3. Try uploading a file
4. Open in another window - file should appear!
5. Go to `/secret` endpoint to test secret vault
   - First password: `hartmann69420`
   - Second password: `idhensk8473hhejsi`

## Troubleshooting Deployment

**Site shows blank?**
- Check Vercel deployment logs
- Ensure all files are committed to GitHub
- Clear browser cache

**Auth pages not working?**
- Verify HTML files are in root directory
- Check Vercel rewrite rules for `/secret`

**Files not syncing?**
- Check Firebase is initialized (open Console, no red errors)
- Verify Firebase credentials in `firebase-config.js`
- Check Firestore collections in Firebase Console

## Useful Commands

```bash
# Check git status
git status

# View recent commits
git log --oneline -5

# Stage specific file
git add filename.js

# Unstage changes
git reset filename.js

# View what will be pushed
git diff origin/main
```

## Your Live URL

After deployment, your site will be at:
```
https://your-project-name.vercel.app
```

And secret vault at:
```
https://your-project-name.vercel.app/secret
```

Done! Your site is now live with shared file storage! 🚀
