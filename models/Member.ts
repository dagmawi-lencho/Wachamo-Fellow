import mongoose, { Schema, Document } from 'mongoose';

export interface IMember extends Document {
  // Personal Information
  fullName: string;
  sex: 'Male' | 'Female';
  age: number;
  phoneNumber: string;
  
  // Academic Details
  studentId: string;
  college: string;
  department: string;
  section: string;
  academicYear: string;
  
  // Fellowship Information
  membershipStatus: 'New Member' | 'Existing Member';
  fellowshipTeam: string;
  leadershipRole?: string;
  attendingBibleStudy: 'Yes' | 'No';
  bibleStudyRole?: string;
  
  // Spiritual / Personal Section
  bornAgain: 'Yes' | 'No';
  churchName: string;
  spiritualGift: string;
  favoriteBibleVerse?: string;
  prayerRequest?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

const MemberSchema: Schema = new Schema({
  // Personal Information
  fullName: { type: String, required: true },
  sex: { type: String, enum: ['Male', 'Female'], required: true },
  age: { type: Number, required: true },
  phoneNumber: { type: String, required: true },
  
  // Academic Details
  studentId: { type: String, required: true, unique: true },
  college: { type: String, required: true },
  department: { type: String, required: true },
  section: { type: String, required: true },
  academicYear: { type: String, required: true },
  
  // Fellowship Information
  membershipStatus: { 
    type: String, 
    enum: ['New Member', 'Existing Member'], 
    required: true 
  },
  fellowshipTeam: { type: String, required: true },
  leadershipRole: { type: String },
  attendingBibleStudy: { type: String, enum: ['Yes', 'No'], required: true },
  bibleStudyRole: { type: String },
  
  // Spiritual / Personal Section
  bornAgain: { type: String, enum: ['Yes', 'No'], required: true },
  churchName: { type: String, required: true },
  spiritualGift: { type: String, required: true },
  favoriteBibleVerse: { type: String, required: false },
  prayerRequest: { type: String },
}, {
  timestamps: true
});

export default mongoose.models.Member || mongoose.model<IMember>('Member', MemberSchema);


