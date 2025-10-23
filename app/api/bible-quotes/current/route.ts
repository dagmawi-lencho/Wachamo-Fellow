import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BibleQuote from '@/models/BibleQuote';

// Get current rotating Bible quote (changes every 2 hours)
export async function GET() {
  try {
    await connectDB();
    
    const quotes = await BibleQuote.find({ isActive: true });
    
    // Default quote if no quotes in database
    const defaultQuote = {
      verse: "For where two or three gather in my name, there am I with them.",
      reference: "Matthew 18:20"
    };
    
    if (quotes.length === 0) {
      return NextResponse.json({
        success: true,
        quote: defaultQuote
      });
    }
    
    // Rotate quote every 2 hours
    // Calculate which quote to show based on current time
    const now = new Date();
    const hoursSinceEpoch = Math.floor(now.getTime() / (1000 * 60 * 60));
    const rotationIndex = Math.floor(hoursSinceEpoch / 2) % quotes.length;
    
    const currentQuote = quotes[rotationIndex];
    
    return NextResponse.json({
      success: true,
      quote: {
        verse: currentQuote.verse,
        reference: currentQuote.reference
      }
    });
  } catch (error: unknown) {
    // Return default quote on error
    return NextResponse.json({
      success: true,
      quote: {
        verse: "For where two or three gather in my name, there am I with them.",
        reference: "Matthew 18:20"
      }
    });
  }
}

