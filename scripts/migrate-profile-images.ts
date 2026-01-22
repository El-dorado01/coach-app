/**
 * Migration Script: Re-fetch profiles with expired image URLs
 *
 * This script identifies profiles with expired Instagram image URLs
 * and re-fetches them from Bright Data API to get fresh URLs,
 * which are then uploaded to Supabase Storage.
 *
 * Usage: node scripts/migrate-profile-images.js
 */

import { db } from '../lib/db';
import { BrightDataProvider } from '../lib/providers/brightdata-provider';

const BATCH_SIZE = 10; // Process 10 profiles at a time to avoid rate limits
const DELAY_BETWEEN_BATCHES = 5000; // 5 seconds delay between batches

// Check if URL is already a Supabase Storage URL
function isMigrated(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.includes('supabase.co/storage');
}

async function migrateProfileImages() {
  console.log('🔍 Starting profile image migration...\n');

  try {
    // Get all profiles from database
    const profiles = await db.coachProfile.findMany({
      select: {
        id: true,
        username: true,
        profilePicture: true,
        profilePicUrl: true,
      },
    });

    console.log(`📊 Found ${profiles.length} profiles in database\n`);

    // Filter profiles that haven't been migrated yet
    // logic: Process ANY profile that doesn't have a Supabase URL
    const profilesToMigrate = profiles.filter((profile) => {
      const url = profile.profilePicUrl || profile.profilePicture;
      return !isMigrated(url);
    });

    console.log(
      `\n📋 Found ${profilesToMigrate.length} profiles to migrate (not on supabase yet)\n`,
    );

    if (profilesToMigrate.length === 0) {
      console.log('✅ All profile images satisfy migration criteria!');
      return;
    }

    // Initialize Bright Data provider
    const apiKey = process.env.BRIGHT_DATA_API_KEY;
    if (!apiKey) {
      throw new Error('BRIGHT_DATA_API_KEY not found in environment variables');
    }

    const provider = new BrightDataProvider(apiKey);

    // Process in batches
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < profilesToMigrate.length; i += BATCH_SIZE) {
      const batch = profilesToMigrate.slice(i, i + BATCH_SIZE);
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(profilesToMigrate.length / BATCH_SIZE);

      console.log(
        `\n📦 Processing batch ${batchNumber}/${totalBatches} (${batch.length} profiles)...\n`,
      );

      for (const profile of batch) {
        try {
          console.log(`  ⏳ Re-fetching: @${profile.username}...`);

          // CRITICAL: Mark profile as stale to force fresh API fetch
          // Set lastFetched to epoch (Jan 1, 1970) to bypass cache
          await db.coachProfile.update({
            where: { username: profile.username },
            data: { lastFetched: new Date(0) },
          });

          // Re-fetch profile from Bright Data API
          // This will automatically upload the new image to Supabase Storage
          // We add a simple retry mechanism for robustness
          let attempts = 0;
          let freshProfile = null;

          while (attempts < 3 && !freshProfile) {
            try {
              freshProfile = await provider.fetchProfile(profile.username);
            } catch (err: any) {
              console.warn(
                `    ⚠️ Attempt ${attempts + 1} failed for @${profile.username}: ${err.message}`,
              );
              attempts++;
              if (attempts < 3) await new Promise((r) => setTimeout(r, 2000)); // Wait 2s before retry
            }
            if (freshProfile) break;
          }

          if (freshProfile) {
            console.log(`  ✅ Successfully migrated: @${profile.username}`);
            successCount++;
          } else {
            console.log(
              `  ⚠️  Profile not found or filtered (after retries): @${profile.username}`,
            );
            failCount++;
          }
        } catch (error) {
          console.error(
            `  ❌ Failed to migrate @${profile.username}:`,
            error instanceof Error ? error.message : error,
          );
          failCount++;
        }

        // Small delay between individual requests
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // Delay between batches to avoid rate limiting
      if (i + BATCH_SIZE < profilesToMigrate.length) {
        console.log(
          `\n⏸️  Waiting ${DELAY_BETWEEN_BATCHES / 1000}s before next batch...`,
        );
        await new Promise((resolve) =>
          setTimeout(resolve, DELAY_BETWEEN_BATCHES),
        );
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 Migration Summary:');
    console.log('='.repeat(50));
    console.log(`✅ Successfully migrated: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`📈 Total processed: ${successCount + failCount}`);
    console.log('='.repeat(50) + '\n');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}

// Run migration
migrateProfileImages()
  .then(() => {
    console.log('✅ Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });
