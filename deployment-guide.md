# Deploying Next.js Wedding RSVP to Google Sites

## Overview
Google Sites cannot directly host Next.js applications, so we need to:
1. Deploy the Next.js app to a hosting service
2. Embed the deployed app in Google Sites using an iframe

## Option 1: Deploy to Vercel (Recommended)

### Step 1: Prepare for Deployment
1. **Download your project files** from v0
2. **Create a GitHub repository**:
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/wedding-rsvp.git
   git push -u origin main
   \`\`\`

### Step 2: Deploy to Vercel
1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Configure project**:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: Leave empty
6. **Add Environment Variables**:
   - `ADMIN_PASSWORD`: Your admin password
   - `RSVP_ACCESS_PASSWORD`: Your RSVP access password (if needed)
7. **Click "Deploy"**

### Step 3: Get Your Deployment URL
After deployment, you'll get a URL like:
\`\`\`
https://your-wedding-rsvp.vercel.app
\`\`\`

### Step 4: Embed in Google Sites
1. **Open your Google Site**
2. **Click "Insert" → "Embed"**
3. **Paste your Vercel URL**
4. **Set dimensions**:
   - Width: 100%
   - Height: 800px (adjust as needed)
5. **Click "Insert"**

## Option 2: Deploy to Netlify

### Step 1: Build Settings
Create a `netlify.toml` file in your project root:
\`\`\`toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
\`\`\`

### Step 2: Deploy to Netlify
1. **Go to [netlify.com](https://netlify.com)**
2. **Sign up/Login**
3. **Drag and drop** your project folder OR connect GitHub
4. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. **Add environment variables** in Site Settings
6. **Deploy**

### Step 3: Embed in Google Sites
Same process as Vercel - use the Netlify URL in Google Sites embed.

## Option 3: Deploy to Railway

### Step 1: Prepare Railway Deployment
Create a `railway.json` file:
\`\`\`json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
\`\`\`

### Step 2: Deploy to Railway
1. **Go to [railway.app](https://railway.app)**
2. **Sign up with GitHub**
3. **Create new project**
4. **Connect GitHub repository**
5. **Add environment variables**
6. **Deploy**

## Database Options

### Option A: Vercel Postgres (Recommended for Vercel)
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Create database
vercel postgres create
\`\`\`

Add to your environment variables:
\`\`\`
POSTGRES_URL="your-postgres-url"
\`\`\`

### Option B: Supabase (Works with any hosting)
1. **Go to [supabase.com](https://supabase.com)**
2. **Create new project**
3. **Get connection string**
4. **Add to environment variables**:
   \`\`\`
   DATABASE_URL="your-supabase-url"
   SUPABASE_ANON_KEY="your-anon-key"
   \`\`\`

### Option C: PlanetScale (MySQL)
1. **Go to [planetscale.com](https://planetscale.com)**
2. **Create database**
3. **Get connection string**
4. **Add to environment variables**

## Google Sites Embedding Best Practices

### 1. Responsive Iframe
\`\`\`html
<div style="position: relative; width: 100%; height: 0; padding-bottom: 75%;">
  <iframe 
    src="https://your-wedding-rsvp.vercel.app" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
    title="Wedding RSVP">
  </iframe>
</div>
\`\`\`

### 2. Full-Screen Option
Create a dedicated page in Google Sites:
- **Page Type**: Full-width
- **Embed**: Set to 100% width and 100vh height
- **Remove**: Headers and footers for seamless experience

### 3. Mobile Optimization
Ensure your Next.js app is mobile-responsive:
- Test on mobile devices
- Use viewport meta tag
- Responsive breakpoints

## Security Considerations

### 1. Environment Variables
Never commit sensitive data. Use environment variables for:
- Database URLs
- API keys
- Admin passwords

### 2. CORS Configuration
If needed, configure CORS in your Next.js app:
\`\`\`javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ]
  },
}
\`\`\`

### 3. Domain Restrictions
Optionally restrict embedding to your Google Sites domain:
\`\`\`javascript
// middleware.js
export function middleware(request) {
  const referer = request.headers.get('referer')
  if (referer && !referer.includes('sites.google.com')) {
    return new Response('Forbidden', { status: 403 })
  }
}
\`\`\`

## Troubleshooting

### Common Issues:

1. **Build Errors**:
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Database Connection**:
   - Verify environment variables
   - Check database URL format
   - Ensure database is accessible

3. **Iframe Not Loading**:
   - Check X-Frame-Options headers
   - Verify HTTPS (required for Google Sites)
   - Test URL directly in browser

4. **Mobile Issues**:
   - Test responsive design
   - Check viewport settings
   - Verify touch interactions

## Performance Optimization

### 1. Next.js Optimization
\`\`\`javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-domain.com'],
  },
  compress: true,
  poweredByHeader: false,
}
\`\`\`

### 2. Database Optimization
- Use connection pooling
- Implement caching where appropriate
- Optimize queries

### 3. Loading States
Ensure good UX with loading states for:
- Initial page load
- Form submissions
- Data fetching

## Monitoring and Analytics

### 1. Vercel Analytics
Enable Vercel Analytics for deployment insights.

### 2. Error Tracking
Consider adding error tracking:
\`\`\`bash
npm install @sentry/nextjs
\`\`\`

### 3. Performance Monitoring
Monitor Core Web Vitals and user experience.

## Backup and Recovery

### 1. Database Backups
Set up automated database backups.

### 2. Code Backups
Ensure code is backed up in GitHub.

### 3. Export Functionality
Your app already includes data export features for backup.

## Final Checklist

- [ ] Next.js app deployed successfully
- [ ] Database connected and working
- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] Mobile responsive
- [ ] Embedded in Google Sites
- [ ] Admin panel accessible
- [ ] RSVP form functional
- [ ] Email confirmations working
- [ ] Data export working
- [ ] Error handling in place
- [ ] Performance optimized
