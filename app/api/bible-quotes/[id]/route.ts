import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BibleQuote from '@/models/BibleQuote';

// Update Bible quote
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const data = await request.json();
    
    const quote = await BibleQuote.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );
    
    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Quote updated successfully',
      quote
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update quote';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Delete Bible quote
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const quote = await BibleQuote.findByIdAndDelete(id);
    
    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Quote deleted successfully'
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete quote';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

