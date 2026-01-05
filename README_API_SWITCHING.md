# Switching Between Instagram API Providers

This codebase supports multiple Instagram API providers. You can switch between them with a single environment variable change.

## Supported Providers

1. **HasData** (default) - Free tier: 1,000 API calls
2. **Bright Data** - Enterprise-grade scraping API

## How to Switch

### Option 1: Environment Variable (Recommended)

Add or update this in your `.env.local` file:

```bash
# Use HasData (default)
INSTAGRAM_API_PROVIDER=hasdata
HASDATA_API_KEY=your_hasdata_api_key

# OR use Bright Data
INSTAGRAM_API_PROVIDER=brightdata
BRIGHT_DATA_API_KEY=your_bright_data_api_key
BRIGHT_DATA_DATASET_ID=gd_l1vikfch901nx3by4  # Optional, has default
```

### Option 2: Code Configuration

Edit `lib/config.ts`:

```typescript
export const INSTAGRAM_API_PROVIDER = 'brightdata'; // or 'hasdata'
```

## Environment Variables

### HasData

- `HASDATA_API_KEY` - Your HasData API key

### Bright Data

- `BRIGHT_DATA_API_KEY` - Your Bright Data API key (Bearer token)
- `BRIGHT_DATA_DATASET_ID` - Your dataset ID (optional, defaults to `gd_l1vikfch901nx3by4`)

## Provider Differences

### HasData

- ✅ Simple REST API
- ✅ Fast response times
- ✅ Free tier available
- ❌ Rate limits on free tier

### Bright Data

- ✅ Enterprise-grade reliability
- ✅ More comprehensive data
- ✅ Better for production
- ❌ Requires paid subscription

## Architecture

The codebase uses a provider pattern:

```
lib/
  providers/
    base-provider.ts      # Interface definition
    hasdata-provider.ts   # HasData implementation
    brightdata-provider.ts # Bright Data implementation
    index.ts              # Factory function
  config.ts              # Provider selection
```

All providers implement the same `InstagramProvider` interface, so switching is seamless!
