import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Member from '@/models/Member';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const data = await request.json();
    
    // Check if student ID already exists
    const existingMember = await Member.findOne({ studentId: data.studentId });
    if (existingMember) {
      return NextResponse.json(
        { error: 'A member with this Student ID already exists' },
        { status: 400 }
      );
    }
    
    const member = await Member.create(data);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Registration successful',
      member 
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('Registration error:', error);
    const message = error instanceof Error ? error.message : 'Registration failed';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    
    const skip = (page - 1) * limit;
    
    const query: Record<string, unknown> = {};
    
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { college: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.membershipStatus = category;
    }
    
    const members = await Member.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Member.countDocuments(query);
    
    return NextResponse.json({
      members,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch members';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

