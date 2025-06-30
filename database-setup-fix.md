# Database Setup Fix

## Issue Resolution
Your project already has a `POSTGRES_URL` environment variable configured. Instead of adding Neon integration (which would create conflicts), we'll use your existing Postgres connection.

## Steps to Fix:

### 1. Use Existing Database Connection
- ✅ Updated `lib/database.ts` to use `POSTGRES_URL`
- ✅ Created API routes for database operations
- ✅ No need to add Neon integration

### 2. Initialize Your Database
Run this SQL script on your existing Postgres database:

\`\`\`sql
-- Create tables (run this once)
CREATE TABLE IF NOT EXISTS invitations (
    id VARCHAR(255) PRIMARY KEY,
    primary_guest_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    party_size INTEGER NOT NULL,
    rsvp_status VARCHAR(50) DEFAULT 'pending',
    invitation_type VARCHAR(50) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    special_notes TEXT,
    table_assignment VARCHAR(100),
    invitation_sent_date DATE,
    rsvp_deadline DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rsvp_submissions (
    id VARCHAR(255) PRIMARY KEY,
    invitation_id VARCHAR(255) REFERENCES invitations(id),
    submission_number INTEGER NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_current BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS guests (
    id VARCHAR(255) PRIMARY KEY,
    submission_id VARCHAR(255) REFERENCES rsvp_submissions(id),
    name VARCHAR(255) NOT NULL,
    bowling BOOLEAN DEFAULT false,
    beers_and_cheers BOOLEAN DEFAULT false,
    ceremony BOOLEAN DEFAULT false,
    cocktail_hour BOOLEAN DEFAULT false,
    reception BOOLEAN DEFAULT false,
    after_party_brunch BOOLEAN DEFAULT false,
    vegetarian BOOLEAN DEFAULT false,
    vegan BOOLEAN DEFAULT false,
    gluten_free BOOLEAN DEFAULT false,
    dairy_free BOOLEAN DEFAULT false,
    nut_allergy BOOLEAN DEFAULT false,
    shellfish BOOLEAN DEFAULT false,
    kosher BOOLEAN DEFAULT false,
    halal BOOLEAN DEFAULT false,
    other_dietary TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_invitations_email ON invitations(email);
CREATE INDEX IF NOT EXISTS idx_invitations_name ON invitations(primary_guest_name);
CREATE INDEX IF NOT EXISTS idx_submissions_invitation ON rsvp_submissions(invitation_id);
CREATE INDEX IF NOT EXISTS idx_guests_submission ON guests(submission_id);

-- Insert sample invitations
INSERT INTO invitations (id, primary_guest_name, email, party_size, invitation_type) VALUES
('1', 'John Smith', 'john.smith@email.com', 2, 'family'),
('2', 'Sarah Johnson', 'sarah.johnson@email.com', 4, 'standard'),
('3', 'Michael Brown', 'michael.brown@email.com', 1, 'bridal-party'),
('4', 'Emily Davis', 'emily.davis@email.com', 3, 'plus-one')
ON CONFLICT (id) DO NOTHING;
\`\`\`

### 3. Update Your Components
The existing components will now work with the real database instead of mock data.

### 4. Deploy to Vercel
Your existing environment variables will work:
- ✅ `POSTGRES_URL` - Already configured
- ✅ `ADMIN_PASSWORD` - Already configured
- ✅ Other variables - Already configured

### 5. Test Database Connection
After deployment, test:
1. **Guest search** - Should find real invitations
2. **RSVP submission** - Should save to database
3. **Admin panel** - Should show real data
4. **Data export** - Should export real responses

## What's Fixed:
- ✅ **No Neon integration conflict**
- ✅ **Uses existing POSTGRES_URL**
- ✅ **Real database operations**
- ✅ **API routes for data management**
- ✅ **Compatible with existing environment**

## Next Steps:
1. **Run the SQL script** on your Postgres database
2. **Deploy to Vercel** (will use existing environment variables)
3. **Test the application** with real database
4. **Add more invitations** through admin panel

Your wedding RSVP system will now have full database functionality without any environment variable conflicts!
