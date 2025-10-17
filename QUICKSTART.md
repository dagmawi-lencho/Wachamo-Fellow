# 🚀 Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js 18+ installed (`node --version`)
- ✅ MongoDB installed or MongoDB Atlas account
- ✅ Git installed (optional)

## 5-Minute Setup

### 1. Start MongoDB

```bash
# Check if MongoDB is running
sudo systemctl status mongodb

# If not running, start it
sudo systemctl start mongodb
```

### 2. Install Dependencies

```bash
cd /home/alpha-lencho/Projects/Wachamo-Fellow
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Open in Browser

Visit: **http://localhost:3000**

---

## 🎯 What You Get

### User Side (Public)
- **Landing Page**: http://localhost:3000
- **Registration Form**: http://localhost:3000/register

### Admin Side (Protected)
- **Admin Login**: http://localhost:3000/admin/login
- **Dashboard**: http://localhost:3000/admin/dashboard

**Default Admin Credentials:**
- Email: `admin@wachamo.edu.et`
- Password: `admin123`

---

## ✨ Key Features

### Registration Form (Multi-Step)
1. **Step 1**: Personal Information (Name, Sex, Age, Phone)
2. **Step 2**: Academic Details (ID, College, Department, Section, Year)
3. **Step 3**: Fellowship Information (Status, Team, Bible Study)
4. **Step 4**: Spiritual Details (Born Again, Church, Gifts, Bible Verse)

### Admin Dashboard
- **Overview Tab**: Total members, statistics, quick insights
- **Members Tab**: View, search, and manage all registered members
- **Analytics Tab**: Interactive charts and data visualizations
- **Settings**: Control registration periods (open/close, start/end dates)

---

## 🧪 Test the Application

### Test User Registration
1. Go to homepage
2. Click "Get Started"
3. Fill in all required fields (marked with *)
4. Complete all 4 steps
5. Submit and see success message

### Test Admin Features
1. Login at `/admin/login` with default credentials
2. View dashboard statistics
3. Search for members
4. View member details
5. Try changing registration settings
6. View analytics charts

---

## 📊 Sample Data

### Fellowship Teams (Examples)
- Worship Team
- Evangelism Team
- Media Team
- Prayer Team
- Teaching Team
- Ushering Team

### Colleges (Examples)
- College of Natural and Computational Science
- College of Business and Economics
- College of Social Science and Humanities
- College of Agriculture
- College of Engineering and Technology

---

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start development server

# Production
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run linter

# MongoDB
sudo systemctl start mongodb    # Start MongoDB
sudo systemctl stop mongodb     # Stop MongoDB
sudo systemctl status mongodb   # Check MongoDB status
mongosh                         # Open MongoDB shell
```

---

## 🐛 Troubleshooting

### Problem: Can't connect to MongoDB
**Solution**: 
```bash
sudo systemctl start mongodb
```

### Problem: Port 3000 in use
**Solution**: 
```bash
PORT=3001 npm run dev
```

### Problem: Build errors
**Solution**: 
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Problem: Can't login as admin
**Solution**: The admin account is created automatically on first login attempt. Make sure MongoDB is running.

---

## 🌐 API Endpoints Reference

### Public Endpoints
- `GET /api/registration-status` - Check if registration is open
- `POST /api/members` - Register new member

### Admin Endpoints (Requires Authentication)
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/verify` - Verify auth token
- `GET /api/members` - Get all members (with pagination)
- `GET /api/members/[id]` - Get specific member
- `PUT /api/members/[id]` - Update member
- `DELETE /api/members/[id]` - Delete member
- `GET /api/stats` - Get dashboard statistics
- `PUT /api/registration-status` - Update registration settings

---

## 📱 Mobile Testing

The application is fully responsive. Test on mobile by:
1. Get your local IP: `ip addr show` or `ifconfig`
2. Visit `http://YOUR_IP:3000` from mobile device
3. Ensure mobile and computer are on same network

---

## 🎨 Customization Tips

### Change Colors
Edit `app/globals.css`:
```css
--primary: 198 79% 52%;      /* Blue */
--secondary: 27 93% 63%;     /* Orange */
```

### Change Admin Password
Edit `.env.local`:
```
ADMIN_EMAIL=your@email.com
ADMIN_PASSWORD=your_password
```

Then restart the server.

### Add Fellowship Teams
Teams are entered by users during registration, but you can standardize them in your onboarding documentation.

---

## 📚 Next Steps

1. **Customize branding**: Add your fellowship logo to `/public` folder
2. **Configure emails**: Set up email notifications for registrations
3. **Add more features**: Prayer requests management, event calendar, etc.
4. **Deploy**: Choose a hosting platform (Vercel, Railway, DigitalOcean)
5. **Backup**: Set up automated MongoDB backups

---

## 🙏 Need Help?

- Check `README.md` for detailed documentation
- Review `SETUP.md` for advanced configuration
- Contact your fellowship IT team

---

**Built with ❤️ for Wachamo Fellowship**

*"I can do all things through Christ who strengthens me." - Philippians 4:13*


