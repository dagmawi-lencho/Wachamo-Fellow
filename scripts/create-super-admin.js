/**
 * Script to create the initial super admin
 * Run this script once to set up your first super admin account
 * 
 * Usage: node scripts/create-super-admin.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
}

loadEnvFile();

// Super Admin Permissions
const SUPER_ADMIN_PERMISSIONS = [
  'view_overview',
  'view_members',
  'view_transactions',
  'view_analytics',
  'view_banks',
  'edit_members',
  'delete_members',
  'approve_transactions',
  'reject_transactions',
  'view_receipts',
  'manage_products',
  'manage_payment_settings',
  'manage_registration_settings',
  'manage_bible_quotes',
  'manage_banks',
  'export_data',
  'manage_admins'
];

// Admin schema
const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['super_admin', 'admin'],
    default: 'admin'
  },
  permissions: {
    type: [String],
    default: []
  },
}, {
  timestamps: true
});

async function createSuperAdmin() {
  let connection = null;
  
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env.local file');
    }

    console.log('🔌 Connecting to MongoDB...');
    connection = await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get or create Admin model
    const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

    // Get super admin credentials from env or use defaults
    const email = process.env.SUPER_ADMIN_EMAIL || 'superadmin@wachamo.edu.et';
    const password = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@2024';

    // Check if super admin already exists
    const existingAdmin = await Admin.findOne({ email });
    
    if (existingAdmin) {
      if (existingAdmin.role === 'super_admin') {
        console.log('⚠️  Super admin already exists with email:', email);
        console.log('📧 Email:', email);
        console.log('🔑 Use your existing password');
        
        // Update to ensure they have all permissions
        existingAdmin.permissions = SUPER_ADMIN_PERMISSIONS;
        await existingAdmin.save();
        console.log('✅ Super admin permissions updated');
      } else {
        // Upgrade existing admin to super admin
        existingAdmin.role = 'super_admin';
        existingAdmin.permissions = SUPER_ADMIN_PERMISSIONS;
        await existingAdmin.save();
        console.log('✅ Existing admin upgraded to super admin');
        console.log('📧 Email:', email);
        console.log('🔑 Use your existing password');
      }
    } else {
      // Create new super admin
      const hashedPassword = await bcrypt.hash(password, 10);
      
      await Admin.create({
        email,
        password: hashedPassword,
        role: 'super_admin',
        permissions: SUPER_ADMIN_PERMISSIONS
      });

      console.log('🎉 Super admin created successfully!');
      console.log('');
      console.log('═══════════════════════════════════════');
      console.log('📧 Email:', email);
      console.log('🔑 Password:', password);
      console.log('═══════════════════════════════════════');
      console.log('');
      console.log('⚠️  IMPORTANT: Please change your password after first login!');
      console.log('🔒 Store these credentials securely');
    }

    await mongoose.connection.close();
    console.log('');
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating super admin:', error.message);
    if (connection) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

// Run the script
createSuperAdmin();

