import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, {
  timestamps: true
});

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);


