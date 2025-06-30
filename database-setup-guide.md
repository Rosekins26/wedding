# Database Setup Guide

## Issue: Unable to Run SQL Script

Since you can't run the SQL script directly, I've created several alternative methods to set up your database.

## Method 1: Web-Based Setup (Recommended)

### Step 1: Deploy Your App
1. **Push to GitHub** (as planned)
2. **Deploy to Vercel** with your environment variables
3. **Your app will be live** at `https://your-app.vercel.app`

### Step 2: Use the Setup Page
1. **Go to**: `https://your-app.vercel.app/setup`
2. **Enter your admin password**
3. **Click "Full Setup"**
4. **Wait for completion** (creates tables + sample data)

### Step 3: Verify Setup
1. **Go to**: `https://your-app.vercel.app/admin`
2. **Login with admin password**
3. **Check that sample invitations appear**

## Method 2: Database Provider Dashboard

### For Vercel Postgres:
1. **Go to Vercel Dashboard**
2. **Navigate to Storage → Browse**
3. **Use the Query tab**
4. **Copy and paste the SQL from `scripts/create-database.sql`**
5. **Run each section separately**

### For Supabase:
1. **Go to Supabase Dashboard**
2. **Navigate to SQL Editor**
3. **Create a new query**
4. **Paste the SQL content**
5. **Run the query**

### For Neon:
1. **Go to Neon Console**
2. **Navigate to SQL Editor**
3. **Paste the SQL content**
4. **Execute the query**

### For PlanetScale:
1. **Go to PlanetScale Dashboard**
2. **Navigate to Console**
3. **Run the SQL commands**

## Method 3: Using Database Client

### If you have a database client (like pgAdmin, DBeaver, etc.):
1. **Connect using your POSTGRES_URL**
2. **Open a new SQL query window**
3. **Copy the content from `scripts/create-database.sql`**
4. **Execute the query**

## Method 4: Command Line (if you have psql)

### If you have PostgreSQL command line tools:
\`\`\`bash
# Connect to your database
psql "your-postgres-url-here"

# Copy and paste the SQL commands one by one
# Or if you have the file locally:
\i /path/to/create-database.sql
\`\`\`

## What the Setup Creates:

### Tables:
- **invitations**: Stores guest invitation details
- **rsvp_submissions**: Tracks RSVP submissions
- **guests**: Individual guest responses and preferences

### Sample Data:
- **4 test invitations** with different invitation types
- **Ready for testing** all functionality

### Indexes:
- **Performance optimization** for searches
- **Fast lookups** by name and email

## Verification Steps:

After setup, test these features:
1. **Guest search**: Try searching for "John Smith"
2. **RSVP submission**: Complete an RSVP form
3. **Admin panel**: View responses and statistics
4. **Data export**: Download CSV/JSON data

## Troubleshooting:

### If setup fails:
1. **Check your POSTGRES_URL** environment variable
2. **Verify database permissions** (create tables, insert data)
3. **Check Vercel logs** for detailed error messages
4. **Try individual setup steps** instead of full setup

### If you get permission errors:
- Your database user needs **CREATE TABLE** permissions
- Your database user needs **INSERT/UPDATE/DELETE** permissions
- Contact your database provider for permission issues

### If tables already exist:
- The setup is **safe to run multiple times**
- It uses **IF NOT EXISTS** clauses
- **Won't overwrite** existing data

## Next Steps:

Once your database is set up:
1. **Test all functionality** thoroughly
2. **Add your real guest list** through the admin panel
3. **Customize event details** if needed
4. **Deploy and embed** in Google Sites

Your wedding RSVP system will be fully functional with real database persistence!
