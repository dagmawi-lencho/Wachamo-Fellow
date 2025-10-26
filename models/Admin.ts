import mongoose, { Schema, Document } from 'mongoose';
import { Role, Permission } from '@/lib/permissions';

export interface IAdmin extends Document {
  email: string;
  password: string;
  role: Role;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema: Schema = new Schema({
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

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);


