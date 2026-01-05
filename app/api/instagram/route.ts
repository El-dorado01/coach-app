import { NextRequest, NextResponse } from 'next/server';
import { getInstagramProvider } from '@/lib/providers';

/**
 * API Route to fetch Instagram profile data
 * POST /api/instagram
 * Body: { username: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username } = body;

    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    const provider = getInstagramProvider();
    const profile = await provider.fetchProfile(username);

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found or not a German account' },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error in Instagram API route:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to fetch multiple profiles
 * GET /api/instagram?usernames=user1,user2,user3
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const usernamesParam = searchParams.get('usernames');

    if (!usernamesParam) {
      return NextResponse.json(
        { error: 'usernames query parameter is required' },
        { status: 400 }
      );
    }

    const usernames = usernamesParam.split(',').map((u) => u.trim());

    if (usernames.length === 0) {
      return NextResponse.json(
        { error: 'At least one username is required' },
        { status: 400 }
      );
    }

    const provider = getInstagramProvider();
    const profiles = await provider.fetchProfiles(usernames);

    return NextResponse.json({ profiles, count: profiles.length });
  } catch (error) {
    console.error('Error in Instagram API route:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
