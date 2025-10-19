import mongoose, { Schema, Document } from 'mongoose';

interface BankAccount {
  bankName: string;
  accountName: string;
  accountNumber: string;
}

export interface IPaymentSettings extends Document {
  chapaPublicKey?: string;
  chapaSecretKey?: string;
  bankAccounts: BankAccount[];
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSettingsSchema: Schema = new Schema({
  chapaPublicKey: { type: String },
  chapaSecretKey: { type: String },
  bankAccounts: [{
    bankName: { type: String, required: true },
    accountName: { type: String, required: true },
    accountNumber: { type: String, required: true },
  }],
}, {
  timestamps: true
});

export default mongoose.models.PaymentSettings || 
  mongoose.model<IPaymentSettings>('PaymentSettings', PaymentSettingsSchema);

