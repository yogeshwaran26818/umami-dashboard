import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Event } from '@/lib/models';

export async function POST(request) {
  try {
    await connectDB();
    
    const { websiteId, visitorId, url, eventType, duration } = await request.json();
    
    if (!websiteId || !visitorId || !url || !eventType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const event = new Event({
      websiteId,
      visitorId,
      url,
      eventType,
      duration: duration || 0
    });

    await event.save();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}