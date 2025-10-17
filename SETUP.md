# Quick Setup Guide

## Step-by-Step Installation

### 1. MongoDB Setup

#### Option A: Local MongoDB (Recommended for Development)

**Ubuntu/Debian:**
```bash
# Install MongoDB
sudo apt-get install -y mongodb

# Start MongoDB service
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Verify it's running
sudo systemctl status mongodb
```

**Alternative - Using Docker:**
```bash
docker run -d -p 27017:27017 --name wachamo-mongodb mongo:latest
```

#### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Update `.env.local` with your connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wachamo-fellowship
   ```

### 2. Install Dependencies

```bash
cd /home/alpha-lencho/Projects/Wachamo-Fellow
npm install
```

### 3. Configure Environment Variables

The `.env.local` file is already created with default values. For production, update:

```bash
# Edit .env.local
MONGODB_URI=mongodb://localhost:27017/wachamo-fellowship
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=admin@wachamo.edu.et
ADMIN_PASSWORD=admin123
```

**⚠️ Important**: Generate a secure `NEXTAUTH_SECRET` for production:
```bash
openssl rand -base64 32
```

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

### 5. Access the Application

#### User Side:
- Homepage: http://localhost:3000
- Registration: http://localhost:3000/register

#### Admin Side:
- Login: http://localhost:3000/admin/login
- Credentials:
  - Email: `admin@wachamo.edu.et`
  - Password: `admin123`

### 6. Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Troubleshooting

### MongoDB Connection Issues

If you get "MongoDB connection failed":

1. **Check if MongoDB is running:**
   ```bash
   sudo systemctl status mongodb
   ```

2. **Start MongoDB if stopped:**
   ```bash
   sudo systemctl start mongodb
   ```

3. **Check MongoDB connection:**
   ```bash
   mongosh
   ```

### Port 3000 Already in Use

If port 3000 is busy:
```bash
# Kill the process using port 3000
sudo lsof -ti:3000 | xargs kill -9

# Or run on a different port
PORT=3001 npm run dev
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## Initial Admin Setup

On first login, the system will automatically create an admin account using the credentials from `.env.local`. The password is hashed using bcrypt for security.

To change admin credentials later:

1. Login to admin dashboard
2. Or manually update in MongoDB:
   ```bash
   mongosh
   use wachamo-fellowship
   db.admins.find()
   ```

## Database Management

### View Data
```bash
mongosh
use wachamo-fellowship

# List all collections
show collections

# View members
db.members.find().pretty()

# View admin
db.admins.find().pretty()

# View registration settings
db.registrationsettings.find().pretty()
```

### Clear Data (Development Only)
```bash
mongosh
use wachamo-fellowship

# Clear all members
db.members.deleteMany({})

# Reset registration settings
db.registrationsettings.deleteMany({})
```

## Features to Test

### User Registration Flow:
1. ✅ Visit homepage
2. ✅ Click "Get Started"
3. ✅ Complete 4-step form with validation
4. ✅ Submit and see success message
5. ✅ Try registering with same Student ID (should fail)

### Admin Dashboard:
1. ✅ Login with admin credentials
2. ✅ View statistics on Overview tab
3. ✅ Search and filter members
4. ✅ View member details
5. ✅ Delete a member
6. ✅ View analytics charts
7. ✅ Control registration settings (open/close, set dates)
8. ✅ Logout

## Performance Tips

### Production Optimization:
1. Use environment variables for all secrets
2. Enable MongoDB indexes for faster queries
3. Consider using Redis for session storage
4. Use a CDN for static assets
5. Enable Next.js image optimization

### MongoDB Indexes:
```javascript
// Connect to MongoDB and create indexes
db.members.createIndex({ studentId: 1 }, { unique: true })
db.members.createIndex({ fullName: "text", department: "text", college: "text" })
db.members.createIndex({ createdAt: -1 })
```

## Deployment Options

### Vercel (Easiest)
1. Push code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

### Docker
```dockerfile
# Create Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Traditional Server
1. Install Node.js and MongoDB on server
2. Clone repository
3. Set up environment variables
4. Run with PM2:
   ```bash
   npm install -g pm2
   pm2 start npm --name "wachamo-fellowship" -- start
   ```

## Support

For issues or questions:
- Check the main README.md
- Review the troubleshooting section above
- Contact the fellowship IT team

---

**May your setup be smooth and your fellowship blessed!** 🙏


