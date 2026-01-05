import { InstagramProvider } from './base-provider';
import { CoachProfile } from '../types';
import {
  fetchInstagramProfile,
  mapToCoachProfile,
  isGermanAccount,
} from '../instagram-api';
import type { InstagramProfileResponse } from '../instagram-api';

/**
 * HasData API Provider Implementation
 */
export class HasDataProvider implements InstagramProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async fetchProfile(username: string): Promise<CoachProfile | null> {
    try {
      const response = await fetch(
        `https://api.hasdata.com/scrape/instagram/profile?handle=${encodeURIComponent(
          username
        )}`,
        {
          method: 'GET',
          headers: {
            'x-api-key': this.apiKey,
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

  async fetchProfiles(usernames: string[]): Promise<CoachProfile[]> {
    const profiles: CoachProfile[] = [];

    for (const username of usernames) {
      try {
        const profile = await this.fetchProfile(username);
        if (profile) {
          profiles.push(profile);
        }
        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error fetching ${username}:`, error);
        // Continue with next username
      }
    }

    return profiles;
  }
}

