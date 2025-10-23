import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BibleQuote from '@/models/BibleQuote';

// Get all Bible quotes
export async function GET() {
  try {
    await connectDB();
    
    const quotes = await BibleQuote.find({ isActive: true })
      .sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      quotes
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch quotes';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Create new Bible quote
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const data = await request.json();
    const { verse, reference } = data;
    
    if (!verse || !reference) {
      return NextResponse.json({ 
        error: 'Verse and reference are required' 
      }, { status: 400 });
    }
    
    const quote = await BibleQuote.create({
      verse,
      reference,
      isActive: true
    });
    
    return NextResponse.json({
      success: true,
      message: 'Bible quote created successfully',
      quote
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create quote';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

