import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import RegistrationSettings from '@/models/RegistrationSettings';

// Initialize registration settings to ensure they exist
export async function POST() {
  try {
    await connectDB();
    
    // Check if settings exist
    let settings = await RegistrationSettings.findOne();
    
    if (!settings) {
      // Create default settings
      settings = await RegistrationSettings.create({
        isOpen: true
      });
      
      return NextResponse.json({
        success: true,
        message: 'Registration settings initialized',
        settings: {
          isOpen: settings.isOpen,
          startDate: settings.startDate,
          endDate: settings.endDate
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Settings already exist',
      settings: {
        isOpen: settings.isOpen,
        startDate: settings.startDate,
        endDate: settings.endDate
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to initialize settings';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

