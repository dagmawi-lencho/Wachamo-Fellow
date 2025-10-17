import mongoose, { Schema, Document } from 'mongoose';

export interface IRegistrationSettings extends Document {
  isOpen: boolean;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationSettingsSchema: Schema = new Schema({
  isOpen: { type: Boolean, default: true },
  startDate: { type: Date },
  endDate: { type: Date },
}, {
  timestamps: true
});

export default mongoose.models.RegistrationSettings || 
  mongoose.model<IRegistrationSettings>('RegistrationSettings', RegistrationSettingsSchema);


