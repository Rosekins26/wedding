#!/bin/bash

# Git setup script for wedding RSVP project
# Run this script in your project directory

echo "🚀 Setting up Git repository for Wedding RSVP project..."

# Initialize git repository
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit: Wedding RSVP system with database integration

Features:
- Guest search and invitation lookup
- Dynamic RSVP forms based on invitation type
- Event attendance tracking (Friday bowling, Saturday beers & cheers, Sunday ceremony/reception, Monday brunch)
- Dietary restrictions collection
- Admin dashboard with data management
- Real-time database integration with PostgreSQL
- Data export functionality
- Mobile-responsive design
- Google Sites embedding support
- Secure admin authentication"

# Set main branch
git branch -M main

echo "✅ Git repository initialized successfully!"
echo ""
echo "Next steps:"
echo "1. Create a new repository on GitHub"
echo "2. Copy the repository URL"
echo "3. Run: git remote add origin <your-github-repo-url>"
echo "4. Run: git push -u origin main"
