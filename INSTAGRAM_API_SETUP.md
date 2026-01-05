# Instagram API Setup Guide

This project uses **HasData's Instagram Profile API** to fetch real Instagram data for German accounts.

## 🎯 Recommended API: HasData

**Why HasData?**

- ✅ **1,000 free API calls** without credit card
- ✅ Includes bio information
- ✅ Easy to use REST API
- ✅ No rate limits on free tier (within 1,000 calls)
- ✅ Returns structured JSON data

**Alternative Options:**

1. **ScrapingBot** - 1,000 free credits (similar to HasData)
2. **Apify** - 100 free profile scrapes (more limited)

## 📋 Setup Instructions

### Step 1: Get Your API Key

1. Visit [HasData Instagram Profile API](https://hasdata.com/apis/instagram-profile-api)
2. Sign up for a free account
3. Get your API key from the dashboard

### Step 2: Configure Environment Variables

Create a `.env.local` file in the root of your project:

```bash
HASDATA_API_KEY=your_api_key_here
```

**Important:** Never commit your `.env.local` file to version control!

### Step 3: Test the API

You can test the API using the provided endpoints:

#### Fetch a single profile:

```bash
POST /api/instagram
Body: { "username": "example_username" }
```

#### Fetch multiple profiles:

```bash
GET /api/instagram?usernames=user1,user2,user3
```

## 🇩🇪 German Account Filtering

The API automatically filters for German accounts by checking:

- Bio content for German keywords (Deutschland, Berlin, München, etc.)
- Location indicators (🇩🇪, DE, etc.)
- German city names
- German language indicators

Accounts that don't match German criteria are automatically filtered out.

## 📊 API Response Format

The API returns data in the `CoachProfile` format:

```typescript
{
  id: string;
  username: string;
  profilePicture: string;
  bio?: string;           // Bio information
  followerCount: number;
  niche: string;
  verified: boolean;
}
```

## 🔧 Usage Examples

### Using the React Hook

```typescript
import { useInstagramData } from '@/lib/hooks/useInstagramData';

function MyComponent() {
  const { profiles, loading, error, fetchProfiles } = useInstagramData();

  // Fetch profiles manually
  const handleFetch = () => {
    fetchProfiles(['username1', 'username2']);
  };

  // Or auto-fetch on mount
  const { profiles } = useInstagramData({
    usernames: ['username1', 'username2'],
    enabled: true,
  });
}
```

### Direct API Call

```typescript
import { fetchInstagramProfile } from '@/lib/instagram-api';

const profile = await fetchInstagramProfile('username', apiKey);
```

## ⚠️ Important Notes

1. **Rate Limiting**: The free tier has 1,000 calls. Use them wisely!
2. **Private Accounts**: Private accounts are automatically skipped
3. **German Filtering**: Only accounts with German indicators are returned
4. **Error Handling**: The API handles 404s, rate limits, and other errors gracefully

## 🚀 Next Steps

1. Get your API key from HasData
2. Add it to `.env.local`
3. Start fetching real Instagram data!

## 📚 API Documentation

- [HasData API Docs](https://hasdata.com/apis/instagram-profile-api)
- [ScrapingBot Alternative](https://scrapingbot.io/instagram)
