import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    console.log('Starting receipt upload...');
    
    const formData = await request.formData();
    const file = formData.get('receipt') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    console.log('File received:', file.name, file.size, 'bytes');
    
    // Convert file to base64 for Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64}`;
    
    console.log('Uploading to Cloudinary...');
    
    // Upload to Cloudinary using upload (not upload_stream)
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'wachamo-fellowship/receipts',
      resource_type: 'image',
      timeout: 60000 // 60 seconds timeout
    });
    
    console.log('Upload successful:', result.secure_url);
    
    return NextResponse.json({
      success: true,
      url: result.secure_url
    });
  } catch (error: unknown) {
    console.error('Upload error:', error);
    const message = error instanceof Error ? error.message : 'Failed to upload receipt';
    return NextResponse.json({ 
      error: message,
      details: error instanceof Error ? error.stack : String(error)
    }, { status: 500 });
  }
}

