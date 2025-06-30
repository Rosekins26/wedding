-- Create database schema for wedding RSVP system
-- Run this on your chosen database platform

-- Invitations table
CREATE TABLE invitations (
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

-- RSVP submissions table
CREATE TABLE rsvp_submissions (
    id VARCHAR(255) PRIMARY KEY,
    invitation_id VARCHAR(255) REFERENCES invitations(id),
    submission_number INTEGER NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_current BOOLEAN DEFAULT true
);

-- Guests table
CREATE TABLE guests (
    id VARCHAR(255) PRIMARY KEY,
    submission_id VARCHAR(255) REFERENCES rsvp_submissions(id),
    name VARCHAR(255) NOT NULL,
    -- Events
    bowling BOOLEAN DEFAULT false,
    beers_and_cheers BOOLEAN DEFAULT false,
    ceremony BOOLEAN DEFAULT false,
    cocktail_hour BOOLEAN DEFAULT false,
    reception BOOLEAN DEFAULT false,
    after_party_brunch BOOLEAN DEFAULT false,
    -- Dietary restrictions
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

-- Indexes for performance
CREATE INDEX idx_invitations_email ON invitations(email);
CREATE INDEX idx_invitations_name ON invitations(primary_guest_name);
CREATE INDEX idx_submissions_invitation ON rsvp_submissions(invitation_id);
CREATE INDEX idx_guests_submission ON guests(submission_id);

-- Insert sample data
INSERT INTO invitations (id, primary_guest_name, email, party_size, invitation_type) VALUES
('1', 'John Smith', 'john.smith@email.com', 2, 'family'),
('2', 'Sarah Johnson', 'sarah.johnson@email.com', 4, 'standard'),
('3', 'Michael Brown', 'michael.brown@email.com', 1, 'bridal-party'),
('4', 'Emily Davis', 'emily.davis@email.com', 3, 'plus-one');
