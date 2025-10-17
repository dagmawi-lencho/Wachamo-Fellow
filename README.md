# Wachamo University Fellowship Website

A beautiful, modern, and interactive website for the Wachamo University Evangelical Students Union Fellowship. Built with Next.js, TypeScript, MongoDB, and Shadcn UI.

## 🌟 Features

### User Side
- **Beautiful Landing Page** with animated spiritual elements and gradient designs
- **Multi-Step Registration Form** with 4 categorized sections:
  - Personal Information
  - Academic Details
  - Fellowship Information
  - Spiritual & Personal Section
- **Real-time Validation** ensuring all required fields are completed before proceeding
- **Responsive Design** optimized for mobile and desktop
- **Smooth Animations** using Framer Motion for enhanced UX
- **Registration Status Check** to control when registration is open/closed

### Admin Side
- **Secure Login System** with JWT authentication
- **Comprehensive Dashboard** with:
  - Overview stats cards
  - Member management table with search and filtering
  - Advanced analytics with interactive charts
  - Real-time data visualization
- **CRUD Operations** for managing fellowship members
- **Registration Period Control** with start/end date selection
- **Statistics & Analytics**:
  - Members by college, department, and academic year
  - Gender distribution
  - Bible study attendance
  - Fellowship team distribution
  - Recent registration trends

## 🎨 Design Features

- **Primary Color**: Blue (#2ea7df)
- **Secondary Color**: Orange (#f59f45)
- **Gradient Backgrounds** and spiritual-themed animations
- **Christian Elements**: Cross icons, Bible verses, spiritual imagery
- **Interactive UI** with hover effects and smooth transitions
- **Mobile-Friendly** responsive design

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB installed and running locally or MongoDB Atlas account

### Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Set up Environment Variables**

The `.env.local` file is already created with default values:
```
MONGODB_URI=mongodb://localhost:27017/wachamo-fellowship
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=admin@wachamo.edu.et
ADMIN_PASSWORD=admin123
```

**Important**: Change these values in production!

3. **Start MongoDB**

If using local MongoDB:
```bash
# On Ubuntu/Debian
sudo systemctl start mongodb

# Or using mongod directly
mongod
```

4. **Run the Development Server**
```bash
npm run dev
```

5. **Open the Application**

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Usage

### For Members (User Side)

1. Visit the homepage
2. Click the **"Get Started"** button
3. Complete the 4-step registration form:
   - Fill in all required fields marked with *
   - You cannot proceed to the next step until the current step is complete
   - Review and submit your information
4. Receive confirmation message

### For Administrators

1. Click **"Admin Login"** in the header or visit `/admin/login`
2. Login with credentials:
   - Email: `admin@wachamo.edu.et`
   - Password: `admin123` (default)
3. Access the dashboard with three tabs:
   - **Overview**: Key statistics and quick insights
   - **Members**: View, search, and manage all registered members
   - **Analytics**: Interactive charts and data visualizations
4. Use **Registration Settings** to control registration periods

## 🗂️ Project Structure

```
wachamo-fellow/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── register/page.tsx           # Multi-step registration form
│   ├── admin/
│   │   ├── login/page.tsx         # Admin login
│   │   └── dashboard/page.tsx     # Admin dashboard
│   ├── api/
│   │   ├── members/               # Member CRUD endpoints
│   │   ├── stats/                 # Statistics endpoint
│   │   ├── auth/                  # Authentication endpoints
│   │   └── registration-status/   # Registration control
│   ├── layout.tsx                 # Root layout
│   └── globals.css                # Global styles
├── components/ui/                  # Shadcn UI components
├── lib/
│   ├── mongodb.ts                 # MongoDB connection
│   └── utils.ts                   # Utility functions
├── models/
│   ├── Member.ts                  # Member schema
│   ├── Admin.ts                   # Admin schema
│   └── RegistrationSettings.ts   # Settings schema
├── middleware.ts                   # Route protection
└── .env.local                     # Environment variables
```

## 🔐 Security Features

- JWT-based authentication for admin access
- HTTP-only cookies for token storage
- Password hashing with bcrypt
- Protected admin routes with middleware
- Input validation and sanitization

## 📊 Database Collections

### Members Collection
Stores all registered fellowship members with:
- Personal information (name, sex, age, phone)
- Academic details (ID, college, department, section, year)
- Fellowship information (status, team, leadership role)
- Spiritual details (born again status, church, gifts, Bible verse)

### Admin Collection
Stores admin credentials (hashed passwords)

### RegistrationSettings Collection
Controls registration availability and time periods

## 🎯 API Endpoints

### Public Endpoints
- `GET /api/registration-status` - Check if registration is open
- `POST /api/members` - Register new member

### Protected Endpoints (Admin Only)
- `GET /api/members` - Get all members with pagination
- `GET /api/members/[id]` - Get specific member
- `PUT /api/members/[id]` - Update member
- `DELETE /api/members/[id]` - Delete member
- `GET /api/stats` - Get dashboard statistics
- `PUT /api/registration-status` - Update registration settings
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/verify` - Verify admin token

## 🛠️ Technologies Used

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Animations**: Framer Motion
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, bcryptjs
- **Charts**: Recharts
- **Icons**: Lucide React

## 🌈 Customization

### Changing Colors
Edit `app/globals.css` to modify the color scheme:
```css
--primary: 198 79% 52%;      /* Blue #2ea7df */
--secondary: 27 93% 63%;     /* Orange #f59f45 */
```

### Changing Admin Credentials
Update `.env.local`:
```
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-secure-password
```

## 📝 License

This project is created for Wachamo University Evangelical Students Union.

## 🙏 Support

For issues or questions, contact the fellowship administrators.

---

**Built with ❤️ for the Wachamo Fellowship Community**

*"For where two or three gather in my name, there am I with them." - Matthew 18:20*
