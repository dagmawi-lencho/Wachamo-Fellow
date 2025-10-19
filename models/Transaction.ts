import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  txRef: string;
  amount: number;
  currency: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  type: 'product' | 'donation';
  productId?: string;
  productName?: string;
  status: 'pending' | 'success' | 'failed';
  chapaReference?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema({
  txRef: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'ETB' },
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  type: { type: String, enum: ['product', 'donation'], required: true },
  productId: { type: String },
  productName: { type: String },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  chapaReference: { type: String },
}, {
  timestamps: true
});

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

