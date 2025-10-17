import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Member from '@/models/Member';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const member = await Member.findById(id);
    
    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ member });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch member';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const data = await request.json();
    const { id } = await params;
    
    const member = await Member.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Member updated successfully',
      member 
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update member';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const member = await Member.findByIdAndDelete(id);
    
    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Member deleted successfully' 
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete member';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

