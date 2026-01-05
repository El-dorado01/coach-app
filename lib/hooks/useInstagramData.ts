import { useState, useEffect } from 'react';
import { CoachProfile } from '../types';

interface UseInstagramDataOptions {
  usernames?: string[];
  enabled?: boolean;
}

interface UseInstagramDataReturn {
  profiles: CoachProfile[];
  loading: boolean;
  error: string | null;
  fetchProfiles: (usernames: string[]) => Promise<void>;
}

/**
 * React hook to fetch Instagram profile data
 */
export function useInstagramData(
  options: UseInstagramDataOptions = {}
): UseInstagramDataReturn {
  const { usernames = [], enabled = false } = options;
  const [profiles, setProfiles] = useState<CoachProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = async (usernamesToFetch: string[]) => {
    if (usernamesToFetch.length === 0) {
      setProfiles([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/instagram?usernames=${usernamesToFetch.join(',')}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch profiles');
      }

      const data = await response.json();
      setProfiles(data.profiles || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setProfiles([]);
      console.error('Error fetching Instagram profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enabled && usernames.length > 0) {
      fetchProfiles(usernames);
    }
  }, [enabled, usernames.join(',')]);

  return {
    profiles,
    loading,
    error,
    fetchProfiles,
  };
}

