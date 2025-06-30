# Google Sites Setup Instructions

## Option 1: Embed as HTML (Recommended)

### Step 1: Upload to Google Drive
1. Download the `index.html` file
2. Upload it to your Google Drive
3. Right-click → "Get link" → Set to "Anyone with the link can view"
4. Copy the file ID from the URL (the long string between `/d/` and `/view`)

### Step 2: Create Embed URL
Replace `FILE_ID` with your actual file ID:
\`\`\`
https://drive.google.com/file/d/FILE_ID/preview
\`\`\`

### Step 3: Add to Google Sites
1. Go to your Google Site
2. Click "Insert" → "Embed"
3. Paste the embed URL
4. Set size to: Width: 100%, Height: 800px (or adjust as needed)

## Option 2: Host on External Service

### Step 1: Upload to GitHub Pages
1. Create a new GitHub repository
2. Upload the `index.html` file
3. Go to Settings → Pages
4. Select "Deploy from a branch" → "main"
5. Your site will be available at: `https://yourusername.github.io/repositoryname`

### Step 2: Embed in Google Sites
1. In Google Sites, click "Insert" → "Embed"
2. Paste your GitHub Pages URL
3. Adjust size as needed

## Option 3: Copy HTML Content

### For Advanced Users:
1. In Google Sites, add a "Text" element
2. Click the HTML button (`<>`)
3. Paste the entire HTML content from `index.html`
4. Save and publish

## Features Included:

✅ **Guest Search** - Find invitations by name
✅ **Dynamic Forms** - Different events based on invitation type
✅ **Event Access Control** - Bridal party, family, standard, plus-one
✅ **Dietary Restrictions** - Full dietary tracking
✅ **Mobile Responsive** - Works on all devices
✅ **Wedding Theme** - Matches your color scheme (#fff2cc background, #294a46 text)
✅ **Confirmation Page** - Shows submission summary
✅ **Error Handling** - Validates all required fields

## Customization:

### To Add More Guests:
Edit the `invitations` array in the JavaScript section:
\`\`\`javascript
{
    id: "5",
    primaryGuestName: "New Guest Name",
    email: "guest@email.com",
    partySize: 2,
    invitationType: "standard" // or "family", "bridal-party", "plus-one"
}
\`\`\`

### To Change Colors:
Modify the CSS variables at the top of the `<style>` section.

### To Update Event Details:
Edit the event descriptions in the `updateSchedule()` and `generateGuestForms()` functions.

## Data Collection:

**Note:** This static version doesn't save data to a database. For data collection, you'll need to:
1. Add a form submission service (like Formspree, Netlify Forms, or Google Forms)
2. Or use the full Next.js version with a database

## Support:

If you need help with setup, the static version provides all the functionality for guests to fill out RSVPs, but you'll need to implement a backend service to collect the actual submissions.
