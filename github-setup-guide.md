# GitHub Setup Guide

## Step 1: Download Your Project Files

1. **Download all files** from v0 to your local computer
2. **Create a new folder** called `wedding-rsvp` 
3. **Extract all files** into this folder

## Step 2: Create GitHub Repository

### Option A: GitHub Website
1. **Go to [github.com](https://github.com)**
2. **Click "New repository"** (green button)
3. **Repository name**: `wedding-rsvp` (or your preferred name)
4. **Description**: `Wedding RSVP system with database integration`
5. **Set to Public** (or Private if you prefer)
6. **Don't initialize** with README, .gitignore, or license (we already have files)
7. **Click "Create repository"**

### Option B: GitHub CLI (if you have it installed)
\`\`\`bash
gh repo create wedding-rsvp --public --description "Wedding RSVP system with database integration"
\`\`\`

## Step 3: Initialize Git and Push

### Open Terminal/Command Prompt in your project folder:

#### For Windows (Command Prompt or PowerShell):
\`\`\`cmd
cd path\to\your\wedding-rsvp-folder
\`\`\`

#### For Mac/Linux (Terminal):
\`\`\`bash
cd /path/to/your/wedding-rsvp-folder
\`\`\`

### Run these commands one by one:

\`\`\`bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Wedding RSVP system

Features:
- Guest search and invitation lookup  
- Dynamic RSVP forms based on invitation type
- Event attendance tracking
- Dietary restrictions collection
- Admin dashboard with data management
- Real-time database integration
- Data export functionality
- Mobile-responsive design
- Google Sites embedding support"

# Set main branch
git branch -M main

# Add your GitHub repository as remote origin
# Replace YOUR_USERNAME and YOUR_REPO_NAME with your actual values
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
\`\`\`

## Step 4: Verify Upload

1. **Refresh your GitHub repository page**
2. **You should see all your files** uploaded
3. **Check that these key files are present**:
   - `package.json`
   - `next.config.js`
   - `app/` folder with all components
   - `components/` folder
   - `lib/database.ts`
   - `types/rsvp.ts`

## Step 5: Connect to Vercel

### Option A: Vercel Dashboard
1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/Login with GitHub**
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Configure settings**:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: (leave empty)

### Option B: Vercel CLI
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy from your project folder
vercel

# Follow the prompts to link to your GitHub repo
\`\`\`

## Step 6: Add Environment Variables in Vercel

In your Vercel project dashboard:

1. **Go to Settings → Environment Variables**
2. **Add these variables**:
   - `POSTGRES_URL`: Your database connection string
   - `ADMIN_PASSWORD`: Your admin panel password
   - `RSVP_ACCESS_PASSWORD`: (if needed)

## Step 7: Deploy and Test

1. **Vercel will auto-deploy** when you push to GitHub
2. **Get your deployment URL**: `https://your-project.vercel.app`
3. **Test all functionality**:
   - Guest search
   - RSVP submission
   - Admin panel
   - Database operations

## Troubleshooting

### If git commands don't work:
1. **Install Git**: [git-scm.com](https://git-scm.com/)
2. **Configure Git**:
   \`\`\`bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   \`\`\`

### If you get authentication errors:
1. **Use GitHub Personal Access Token** instead of password
2. **Or use SSH keys** for authentication
3. **Or use GitHub Desktop** for a GUI approach

### If you need to update files later:
\`\`\`bash
# Make your changes, then:
git add .
git commit -m "Update: description of changes"
git push
\`\`\`

## Alternative: GitHub Desktop (GUI Method)

If you prefer a visual interface:

1. **Download [GitHub Desktop](https://desktop.github.com/)**
2. **Install and sign in** to your GitHub account
3. **Click "Create a New Repository on your hard drive"**
4. **Choose your project folder**
5. **Commit and publish** to GitHub

## File Structure Check

Make sure your uploaded repository has this structure:
\`\`\`
wedding-rsvp/
├── app/
│   ├── admin/
│   ├── api/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── admin-dashboard.tsx
│   ├── admin-login.tsx
│   ├── email-sender.tsx
│   ├── export-responses.tsx
│   ├── guest-form.tsx
│   ├── invitation-search.tsx
│   ├── rsvp-confirmation.tsx
│   └── rsvp-form.tsx
├── data/
│   └── invitations.ts
├── lib/
│   └── database.ts
├── scripts/
│   └── create-database.sql
├── types/
│   └── rsvp.ts
├── next.config.js
├── package.json
├── tailwind.config.ts
├── vercel.json
└── wedding-rsvp.tsx
\`\`\`

Once your code is on GitHub, Vercel can automatically deploy it and you'll have your wedding RSVP system live and ready to embed in Google Sites!
