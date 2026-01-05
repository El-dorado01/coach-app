import { CoachProfile } from '../types';

/**
 * Base interface for Instagram API providers
 */
export interface InstagramProvider {
  fetchProfile(username: string): Promise<CoachProfile | null>;
  fetchProfiles(usernames: string[]): Promise<CoachProfile[]>;
}

