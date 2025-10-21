import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  txRef: string;
  orderNumber: string;
  amount: number;
  currency: string;
  email?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  studentId?: string;
  bankName?: string;
  accountNumber?: string;
  type: 'product' | 'donation';
  productId?: string;
  productName?: string;
  orderDetails?: any;
  receiptUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema({
  txRef: { type: String, required: true, unique: true },
  orderNumber: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'ETB' },
  email: { type: String, required: false },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  studentId: { type: String },
  bankName: { type: String },
  accountNumber: { type: String },
  type: { type: String, enum: ['product', 'donation'], required: true },
  productId: { type: String },
  productName: { type: String },
  orderDetails: { type: Schema.Types.Mixed },
  receiptUrl: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  rejectionReason: { type: String },
  approvedBy: { type: String },
  approvedAt: { type: Date },
}, {
  timestamps: true
});

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

