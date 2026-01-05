import { CoachProfile } from './types';

/**
 * Instagram API Service using HasData API
 * Free tier: 1,000 API calls without credit card
 * Documentation: https://hasdata.com/apis/instagram-profile-api
 */

export interface InstagramProfileResponse {
  id: string;
  username: string;
  fullName?: string;
  biography?: string;
  businessCategory?: string;
  bioLinks?: string[];
  externalUrls?: string;
  followersCount: number;
  followsCount: number;
  highlightsCount?: number;
  igtvVideoCount?: number;
  postsCount: number;
  isBusinessAccount: boolean;
  isProfessionalAccount: boolean;
  profilePicUrl?: string;
  profilePicUrlHD?: string;
  fbid?: string;
  latestPosts?: any[];
  requestMetadata?: {
    id: string;
    status: string;
    json: string;
  };
}

/**
 * Check if an account is likely German based on bio content
 */
export function isGermanAccount(bio?: string, fullName?: string): boolean {
  if (!bio && !fullName) return false;

  const text = `${bio || ''} ${fullName || ''}`.toLowerCase();

  // German keywords and indicators
  const germanIndicators = [
    'deutschland',
    'germany',
    'deutsch',
    'berlin',
    'münchen',
    'hamburg',
    'köln',
    'frankfurt',
    'stuttgart',
    'düsseldorf',
    'de',
    '🇩🇪',
    'german',
    'deutsche',
    'deutscher',
    'deutschsprachig',
    'wien', // Austria (German-speaking)
    'zürich', // Switzerland (German-speaking)
    'schweiz',
    'österreich',
  ];

  return germanIndicators.some((indicator) => text.includes(indicator));
}

/**
 * Detect niche from bio content
 */
export function detectNicheFromBio(bio?: string, fullName?: string): string {
  if (!bio && !fullName) return 'Lifestyle';

  const text = `${bio || ''} ${fullName || ''}`.toLowerCase();

  // Niche keywords mapping
  const nicheKeywords: Record<string, string[]> = {
    Fitness: [
      'fitness',
      'trainer',
      'workout',
      'gym',
      'sport',
      'athlet',
      'training',
      'fit',
      'bodybuilding',
      'yoga',
      'pilates',
    ],
    Business: [
      'business',
      'entrepreneur',
      'startup',
      'founder',
      'ceo',
      'coach',
      'consultant',
      'business coach',
    ],
    Marketing: [
      'marketing',
      'social media',
      'content creator',
      'influencer',
      'brand',
      'advertising',
      'digital marketing',
    ],
    Finance: [
      'finance',
      'invest',
      'money',
      'wealth',
      'financial',
      'trading',
      'crypto',
      'stock',
      'finanz',
    ],
    'Personal Development': [
      'personal development',
      'self improvement',
      'mindset',
      'motivation',
      'growth',
      'success',
      'life coach',
    ],
    Nutrition: [
      'nutrition',
      'food',
      'diet',
      'healthy eating',
      'meal',
      'recipe',
      'ernährung',
      'ernährungsberater',
    ],
    Mindfulness: [
      'mindfulness',
      'meditation',
      'yoga',
      'zen',
      'mental health',
      'wellness',
      'mindful',
      'achtsamkeit',
    ],
    'Health & Wellness': [
      'wellness',
      'health',
      'healthy',
      'wellbeing',
      'gesundheit',
      'wohlbefinden',
    ],
    Entrepreneurship: [
      'entrepreneur',
      'startup',
      'founder',
      'business owner',
      'startup coach',
    ],
  };

  // Check each niche
  for (const [niche, keywords] of Object.entries(nicheKeywords)) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      return niche;
    }
  }

  return 'Lifestyle'; // Default
}

/**
 * Map Instagram API response to CoachProfile format
 */
export function mapToCoachProfile(
  data: InstagramProfileResponse,
  niche?: string
): CoachProfile | null {
  // Auto-detect niche from bio if not provided
  const detectedNiche =
    niche || detectNicheFromBio(data.biography, data.fullName);

  return {
    id: data.id || data.username, // Use API id or username as fallback
    username: data.username,
    fullName: data.fullName,
    profilePicture: data.profilePicUrl || data.profilePicUrlHD || '',
    bio: data.biography,
    biography: data.biography,
    externalUrls: data.externalUrls,
    followersCount: data.followersCount || 0,
    followsCount: data.followsCount || 0,
    postsCount: data.postsCount || 0,
    isBusinessAccount: data.isBusinessAccount || false,
    isProfessionalAccount: data.isProfessionalAccount || false,
    profilePicUrl: data.profilePicUrl,
    profilePicUrlHD: data.profilePicUrlHD,
    niche: detectedNiche,
    verified: data.isBusinessAccount || data.isProfessionalAccount, // Use business/professional as verified indicator
  };
}

/**
 * Fetch Instagram profile data from HasData API
 */
export async function fetchInstagramProfile(
  username: string,
  apiKey: string
): Promise<CoachProfile | null> {
  try {
    const response = await fetch(
      `https://api.hasdata.com/scrape/instagram/profile?handle=${encodeURIComponent(
        username
      )}`,
      {
        method: 'GET',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Profile not found: ${username}`);
        return null;
      }
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data: InstagramProfileResponse = await response.json();

    // console.log("Instagram Profile Response: ", data);

    // Check if account is German
    if (!isGermanAccount(data.biography, data.fullName)) {
      return null; // Skip non-German accounts
    }

    return mapToCoachProfile(data);
  } catch (error) {
    console.error(`Error fetching profile for ${username}:`, error);
    throw error;
  }
}

/**
 * Alternative: Fetch from ScrapingBot API (backup option)
 * Free tier: 1,000 free credits
 */
export async function fetchInstagramProfileScrapingBot(
  username: string,
  apiKey: string
): Promise<CoachProfile | null> {
  try {
    const response = await fetch(
      `https://scraping-bot.io/api/instagram/profile?username=${encodeURIComponent(
        username
      )}`,
      {
        method: 'GET',
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: InstagramProfileResponse = await response.json();

    if (!isGermanAccount(data.biography, data.fullName)) {
      return null;
    }

    return mapToCoachProfile(data);
  } catch (error) {
    console.error(`Error fetching profile for ${username}:`, error);
    throw error;
  }
}
