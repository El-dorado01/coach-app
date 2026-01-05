import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy route to fetch images from Instagram CDN
 * This bypasses CORS issues by fetching images server-side
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    // Validate that it's an Instagram/Facebook CDN URL
    const allowedDomains = [
      'cdninstagram.com',
      'fbcdn.net',
      'instagram.com',
    ];

    const url = new URL(imageUrl);
    const isAllowed = allowedDomains.some((domain) => url.hostname.includes(domain));

    if (!isAllowed) {
      return NextResponse.json({ error: 'Invalid image source' }, { status: 400 });
    }

    // Fetch the image from Instagram CDN
    const imageResponse = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.instagram.com/',
      },
    });

    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch image' },
        { status: imageResponse.status }
      );
    }

    // Get the image data
    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

    // Return the image with proper headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error proxying image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

