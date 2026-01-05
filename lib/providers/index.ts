import { InstagramProvider } from './base-provider';
import { HasDataProvider } from './hasdata-provider';
import { BrightDataProvider } from './brightdata-provider';
import { INSTAGRAM_API_PROVIDER } from '../config';

/**
 * Factory function to get the configured Instagram API provider
 */
export function getInstagramProvider(): InstagramProvider {
  const provider = INSTAGRAM_API_PROVIDER;

  if (provider === 'brightdata') {
    const apiKey = process.env.BRIGHT_DATA_API_KEY;
    if (!apiKey) {
      throw new Error(
        'BRIGHT_DATA_API_KEY is required when using Bright Data provider'
      );
    }
    return new BrightDataProvider(apiKey);
  }

  // Default to HasData
  const apiKey = process.env.HASDATA_API_KEY;
  if (!apiKey) {
    throw new Error('HASDATA_API_KEY is required when using HasData provider');
  }
  return new HasDataProvider(apiKey);
}

