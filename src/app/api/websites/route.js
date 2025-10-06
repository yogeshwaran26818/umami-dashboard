import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import connectDB from '@/lib/mongodb';
import { Website } from '@/lib/models';

export async function POST(request) {
  try {
    await connectDB();
    
    const { name, domain } = await request.json();
    
    if (!name || !domain) {
      return NextResponse.json({ error: 'Name and domain are required' }, { status: 400 });
    }

    const websiteId = uuidv4();
    
    const website = new Website({
      websiteId,
      name,
      domain
    });

    await website.save();
    
    return NextResponse.json({
      success: true,
      websiteId,
      name,
      domain
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}