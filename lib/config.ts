/**
 * API Provider Configuration
 * Change this to switch between different Instagram API providers
 */
export const INSTAGRAM_API_PROVIDER = (process.env.INSTAGRAM_API_PROVIDER ||
  'hasdata') as 'hasdata' | 'brightdata';

