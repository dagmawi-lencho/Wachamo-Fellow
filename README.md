# Wachamo University Fellowship Management System

A modern, comprehensive web application for managing the Wachamo University Evangelical Students Union Fellowship. Built with Next.js, TypeScript, MongoDB, and designed with beautiful glassmorphism UI.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)

---

## ✨ Features

### 🎓 Member Management
- **Multi-step Registration Form** - Beautiful 4-step registration process with real-time validation
- **Advanced Search & Filtering** - Filter by fellowship team, college, department, year, and more
- **CRUD Operations** - Complete member management with edit, view, and delete capabilities
- **Excel Export** - Export filtered member data to Excel for reporting
- **Alphabetical Filtering** - Quick access to members by first letter

### 🛍️ E-Commerce System
- **Product Shop** - Browse and purchase fellowship merchandise (Bibles, books, t-shirts, stickers, accessories)
- **Shopping Cart** - Add, remove, and manage cart items with quantity controls
- **Secure Checkout** - Manual payment verification with receipt upload system
- **Order Tracking** - Track order status with unique order numbers
- **Stock Management** - Real-time inventory tracking

### 💰 Donation & Payment
- **Donation Portal** - Separate donation system with receipt verification
- **Multiple Bank Support** - Manage multiple bank accounts for payments
- **Transaction Management** - Approve, reject, or revert transaction statuses
- **Receipt Upload** - Cloudinary-integrated receipt storage and viewing
- **Revenue Analytics** - Track donations, sales, and total revenue

### 📊 Admin Dashboard
- **Real-time Statistics** - Member counts, revenue, transaction status
- **Interactive Charts** - Members by college, department, year, and fellowship team
- **Transaction History** - Complete payment tracking with filtering
- **Product Management** - CRUD operations for shop products
- **Bank Account Management** - Add, edit, and manage fellowship bank accounts
- **Registration Control** - Open/close registration periods with date scheduling

### 🔐 Security & Authentication
- **JWT Authentication** - Secure admin access with HTTP-only cookies
- **Password Hashing** - bcrypt-protected credentials
- **Role-based Access** - Admin-only routes protected by middleware
- **Session Management** - Automatic logout on token expiration

### 🎨 Design & UX
- **Glassmorphism UI** - Modern frosted glass effects with backdrop blur
- **Responsive Design** - Mobile-first, optimized for all screen sizes
- **Smooth Animations** - Framer Motion-powered transitions
- **Spiritual Theme** - Christian elements with blue (#2ea7df) and orange (#f59f45) gradient colors
- **Accessible Forms** - Clear validation, error messages, and user feedback

---

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn UI** - Beautiful component library
- **Framer Motion** - Smooth animations
- **Lucide Icons** - Modern icon set

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Image/receipt storage

### Additional Tools
- **Recharts** - Data visualization and charts
- **XLSX** - Excel export functionality
- **Zustand** - Shopping cart state management

---

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- MongoDB instance (local or MongoDB Atlas)
- Cloudinary account (for receipt uploads)

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/wachamo-fellow.git
cd wachamo-fellow
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
NEXTAUTH_SECRET=your-super-secret-jwt-key-change-in-production
NEXTAUTH_URL=http://localhost:3000

# Cloudinary (for receipt uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin Credentials (change in production!)
ADMIN_EMAIL=admin@wachamo.edu.et
ADMIN_PASSWORD=admin123
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open the application**
Visit [http://localhost:3000](http://localhost:3000)

---

## 🗂️ Project Structure

```
wachamo-fellow/
├── app/                          # Next.js app directory
│   ├── admin/                    # Admin pages
│   │   ├── dashboard/            # Admin dashboard with analytics
│   │   ├── login/                # Admin authentication
│   │   └── products/             # Product management
│   ├── api/                      # API routes
│   │   ├── admins/               # Admin CRUD
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── banks/                # Bank management
│   │   ├── members/              # Member CRUD
│   │   ├── payment/              # Payment processing
│   │   ├── products/             # Product CRUD
│   │   ├── transactions/         # Transaction management
│   │   └── stats/                # Analytics & statistics
│   ├── cart/                     # Shopping cart page
│   ├── checkout/                 # Checkout & payment
│   ├── donate/                   # Donation portal
│   ├── register/                 # Member registration
│   ├── shop/                     # Product shop
│   ├── track-order/              # Order tracking
│   └── page.tsx                  # Landing page
├── components/                   # React components
│   ├── ui/                       # Shadcn UI components
│   ├── AdminManagementDialog.tsx
│   ├── BankManagementDialog.tsx
│   ├── EditMemberDialog.tsx
│   ├── PaymentSettingsDialog.tsx
│   └── ProductDialog.tsx
├── lib/                          # Utility libraries
│   ├── academicData.ts           # College/department data
│   ├── cartStore.ts              # Shopping cart state
│   ├── cloudinary.ts             # Image upload config
│   ├── fellowshipTeams.ts        # Fellowship team data
│   └── mongodb.ts                # Database connection
├── models/                       # MongoDB schemas
│   ├── Admin.ts
│   ├── Bank.ts
│   ├── Member.ts
│   ├── Product.ts
│   ├── Transaction.ts
│   └── RegistrationSettings.ts
├── middleware.ts                 # Route protection
└── package.json
```

---

## 🎯 Usage

### For Members
1. Visit the landing page
2. Click **"Get Started"** to register
3. Complete the 4-step registration form
4. Browse the shop and make purchases
5. Donate to support the fellowship
6. Track orders using order number and student ID

### For Administrators
1. Navigate to `/admin/login`
2. Login with admin credentials
3. Access the dashboard with 5 main tabs:
   - **Overview** - Key statistics and quick insights
   - **Members** - Manage registered members
   - **Transactions** - Approve/reject payments
   - **Analytics** - Interactive charts and trends
   - **Banks** - Manage bank accounts

---

## 🔑 Default Admin Credentials

**Email:** `admin@wachamo.edu.et`  
**Password:** `admin123`

> ⚠️ **Important:** Change these credentials in production!

---

## 📊 Key Models

### Member
- Personal Information (name, sex, age, phone)
- Academic Details (student ID, college, department, year)
- Fellowship Information (team, leadership role, Bible study)
- Spiritual Details (born again status, church, spiritual gifts)

### Transaction
- Order tracking with unique order numbers
- Payment status (pending, approved, rejected)
- Receipt uploads with Cloudinary
- Type differentiation (donation vs product purchase)
- Admin approval/rejection with reasons

### Product
- Name, description, price, category
- Image uploads
- Stock management
- Availability toggle

---

## 🎨 Design System

### Colors
- **Primary:** Blue `#2ea7df`
- **Secondary:** Orange `#f59f45`
- **Gradients:** Blue → Orange transitions

### Typography
- **Font Family:** Inter (300-800 weights)
- **Headings:** Bold (700-800)
- **Body:** Medium (500)
- **Placeholders:** Light (300)

### Components
- **Glassmorphism:** Frosted glass effects with backdrop blur
- **Rounded:** 2xl border radius (16px)
- **Shadows:** Layered with color tints
- **Animations:** 300ms transitions

---

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production
```env
MONGODB_URI=your_production_mongodb_uri
NEXTAUTH_SECRET=strong-random-secret-key
NEXTAUTH_URL=https://yourdomain.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=strong_admin_password
```

---

## 📝 API Endpoints

### Public Endpoints
- `GET /api/registration-status` - Check registration availability
- `POST /api/members` - Register new member
- `GET /api/products` - List products
- `GET /api/banks` - List bank accounts

### Protected Endpoints (Admin)
- `GET /api/members` - Get all members with filtering
- `PUT /api/members/[id]` - Update member
- `DELETE /api/members/[id]` - Delete member
- `GET /api/stats` - Dashboard statistics
- `GET /api/transactions` - Transaction history
- `PUT /api/transactions/[id]` - Approve/reject transaction
- `POST /api/products` - Create product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

---

## 📄 License

This project is created for Wachamo University Evangelical Students Union Fellowship.

---

## 👨‍💻 Developer

**Built by Dagmawi Lencho**

---

## 🙏 Acknowledgments

Built with ❤️ for the Wachamo Fellowship Community

*"For where two or three gather in my name, there am I with them." - Matthew 18:20*

---

## 📞 Support

For issues, questions, or feature requests, please contact the fellowship administrators.
