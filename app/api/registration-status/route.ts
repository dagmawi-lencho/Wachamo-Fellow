import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import RegistrationSettings from '@/models/RegistrationSettings';

export async function GET() {
  try {
    await connectDB();
    
    let settings = await RegistrationSettings.findOne();
    
    if (!settings) {
      // Create default settings if none exist
      settings = await RegistrationSettings.create({
        isOpen: true
      });
    }
    
    // Check if registration is within the time window if dates are set
    let isOpen = settings.isOpen;
    const now = new Date();
    
    if (settings.startDate && settings.endDate) {
      isOpen = isOpen && now >= settings.startDate && now <= settings.endDate;
    }
    
    return NextResponse.json({
      isOpen,
      startDate: settings.startDate,
      endDate: settings.endDate
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch registration status';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();
    
    let settings = await RegistrationSettings.findOne();
    
    if (!settings) {
      settings = await RegistrationSettings.create(data);
    } else {
      settings = await RegistrationSettings.findByIdAndUpdate(
        settings._id,
        data,
        { new: true }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Registration settings updated',
      settings
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update registration settings';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

