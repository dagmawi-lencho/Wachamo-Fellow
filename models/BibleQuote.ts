import mongoose, { Schema, Document } from 'mongoose';

export interface IBibleQuote extends Document {
  verse: string;
  reference: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BibleQuoteSchema: Schema = new Schema({
  verse: { type: String, required: true },
  reference: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true
});

export default mongoose.models.BibleQuote || mongoose.model<IBibleQuote>('BibleQuote', BibleQuoteSchema);

