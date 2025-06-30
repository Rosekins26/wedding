# Wedding RSVP System

A modern, full-featured wedding RSVP system built with Next.js, featuring real-time database integration, admin management, and Google Sites compatibility.

## 🌟 Features

### For Guests
- **Easy invitation lookup** by name
- **Dynamic RSVP forms** based on invitation type
- **Event selection** for wedding weekend activities
- **Dietary restrictions** tracking
- **Mobile-responsive** design
- **Confirmation emails** with RSVP details

### For Wedding Couple
- **Admin dashboard** for managing invitations
- **Real-time RSVP tracking** and statistics
- **Data export** in multiple formats (CSV, JSON)
- **Guest management** with detailed information
- **Multiple submission** tracking per invitation

### Wedding Weekend Events
- **Friday**: Bowling (Bridal Party only)
- **Saturday**: Beers and Cheers with Bride and Groom
- **Sunday**: Wedding Ceremony, Cocktail Hour, Reception
- **Monday**: After Party Brunch (Family only)

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: PostgreSQL (compatible with Vercel Postgres, Supabase, Neon)
- **Deployment**: Vercel
- **Authentication**: Secure admin panel

## 📱 Invitation Types

- **Standard**: Saturday Beers & Cheers + Sunday events
- **Family**: All weekend events + Monday brunch
- **Bridal Party**: All events including Friday bowling
- **Plus One(s)**: Saturday Beers & Cheers + Sunday events

## 🛠️ Setup Instructions

### 1. Clone Repository
\`\`\`bash
git clone https://github.com/yourusername/wedding-rsvp.git
cd wedding-rsvp
npm install
\`\`\`

### 2. Environment Variables
Create a \`.env.local\` file:
\`\`\`
POSTGRES_URL="your-database-connection-string"
ADMIN_PASSWORD="your-admin-password"
\`\`\`

### 3. Database Setup
Run the SQL script in \`scripts/create-database.sql\` on your PostgreSQL database.

### 4. Development
\`\`\`bash
npm run dev
\`\`\`

### 5. Deployment
Deploy to Vercel with one click or use the Vercel CLI.

## 🌐 Google Sites Integration

This system is designed to be embedded in Google Sites:

1. Deploy to Vercel
2. Copy your deployment URL
3. In Google Sites: Insert → Embed → Paste URL
4. Set dimensions: 100% width, 800px height

## 📊 Admin Features

Access the admin panel at \`/admin\` with your admin password:

- View all invitations and responses
- Add new invitations
- Export data in multiple formats
- Track RSVP statistics
- Manage guest information

## 🎨 Customization

### Colors
The system uses a wedding-themed color palette:
- Background: \`#fff2cc\` (cream)
- Primary text: \`#294a46\` (dark green)
- Accent colors for different event types

### Events
Modify events in \`types/rsvp.ts\` and update the corresponding forms.

### Invitation Types
Add or modify invitation types in the \`INVITATION_TYPE_ACCESS\` configuration.

## 📧 Email Integration

The system includes email confirmation functionality. Configure your email service in the environment variables for automatic RSVP confirmations.

## 🔒 Security

- Admin panel protected by password authentication
- Environment variables for sensitive data
- CORS headers configured for Google Sites embedding
- SQL injection protection with parameterized queries

## 📱 Mobile Support

Fully responsive design that works perfectly on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🤝 Contributing

This is a wedding-specific project, but feel free to fork and adapt for your own events!

## 📄 License

MIT License - feel free to use for your own wedding!

## 💝 Wedding Details

Created with love for Lily & Terron's wedding celebration.

For support, contact: lilyandterron2026@gmail.com

---

Built with ❤️ using Next.js and deployed on Vercel
