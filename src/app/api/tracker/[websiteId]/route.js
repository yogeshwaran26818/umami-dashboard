import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { websiteId } = params;
    
    // Read the tracker script from public folder
    const trackerPath = path.join(process.cwd(), 'public', 'tracker.js');
    let trackerScript = fs.readFileSync(trackerPath, 'utf8');
    
    // Replace placeholder with actual websiteId
    trackerScript = trackerScript.replace(
      'const WEBSITE_ID = window.UMAMI_WEBSITE_ID;',
      `const WEBSITE_ID = '${websiteId}';`
    );
    
    return new NextResponse(trackerScript, {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}