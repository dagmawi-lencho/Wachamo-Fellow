/**
 * Script to create the initial super admin
 * Run this script once to set up your first super admin account
 * 
 * Usage: npx ts-node scripts/create-super-admin.ts
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { SUPER_ADMIN_PERMISSIONS, ROLES } from '../lib/permissions';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Admin schema (same as the model)
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

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function createSuperAdmin() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get super admin credentials from env or use defaults
    const email = process.env.SUPER_ADMIN_EMAIL || 'superadmin@wachamo.edu.et';
    const password = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@2024';

    // Check if super admin already exists
    const existingAdmin = await Admin.findOne({ email });
    
    if (existingAdmin) {
      if (existingAdmin.role === ROLES.SUPER_ADMIN) {
        console.log('⚠️  Super admin already exists with email:', email);
        console.log('📧 Email:', email);
        console.log('🔑 Use your existing password');
        
        // Update to ensure they have all permissions
        existingAdmin.permissions = SUPER_ADMIN_PERMISSIONS;
        await existingAdmin.save();
        console.log('✅ Super admin permissions updated');
      } else {
        // Upgrade existing admin to super admin
        existingAdmin.role = ROLES.SUPER_ADMIN;
        existingAdmin.permissions = SUPER_ADMIN_PERMISSIONS;
        await existingAdmin.save();
        console.log('✅ Existing admin upgraded to super admin');
        console.log('📧 Email:', email);
        console.log('🔑 Use your existing password');
      }
    } else {
      // Create new super admin
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const superAdmin = await Admin.create({
        email,
        password: hashedPassword,
        role: ROLES.SUPER_ADMIN,
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
    console.error('❌ Error creating super admin:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the script
createSuperAdmin();

