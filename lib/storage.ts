import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env',
  );
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const BUCKET_NAME = 'profile-pictures';

/**
 * Download an image from a URL and upload it to Supabase Storage
 * @param imageUrl - The URL of the image to download (signed Instagram URL)
 * @param username - Instagram username (used for file naming)
 * @returns The public URL of the uploaded image, or null if upload fails
 */
export async function uploadProfilePicture(
  imageUrl: string,
  username: string,
): Promise<string | null> {
  try {
    if (!imageUrl || !imageUrl.startsWith('http')) {
      console.warn(`Invalid image URL for ${username}:`, imageUrl);
      return null;
    }

    // Download the image
    console.log(`Downloading profile picture for ${username}...`);
    const response = await fetch(imageUrl);

    if (!response.ok) {
      console.error(
        `Failed to download image for ${username}: ${response.status} ${response.statusText}`,
      );
      return null;
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Determine file extension from content type
    const extension = contentType.split('/')[1] || 'jpg';
    const fileName = `${username.toLowerCase()}.${extension}`;
    const filePath = `${fileName}`;

    // Upload to Supabase Storage
    console.log(`Uploading profile picture for ${username} to Supabase...`);
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, imageBuffer, {
        contentType,
        upsert: true, // Overwrite if exists
        cacheControl: '31536000', // Cache for 1 year
      });

    if (error) {
      console.error(`Error uploading image for ${username}:`, error);
      return null;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    console.log(`Successfully uploaded profile picture for ${username}`);
    return publicUrl;
  } catch (error) {
    console.error(`Error in uploadProfilePicture for ${username}:`, error);
    return null;
  }
}

/**
 * Delete a profile picture from Supabase Storage
 * @param username - Instagram username
 */
export async function deleteProfilePicture(username: string): Promise<boolean> {
  try {
    const filePath = `${username.toLowerCase()}.jpg`; // Try common extension

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error(`Error deleting image for ${username}:`, error);
      return false;
    }

    console.log(`Successfully deleted profile picture for ${username}`);
    return true;
  } catch (error) {
    console.error(`Error in deleteProfilePicture for ${username}:`, error);
    return false;
  }
}

/**
 * Check if Supabase Storage is properly configured
 */
export async function checkStorageSetup(): Promise<boolean> {
  try {
    const { data, error } = await supabase.storage.listBuckets();

    if (error) {
      console.error('Error checking storage setup:', error);
      return false;
    }

    const bucketExists = data?.some((bucket) => bucket.name === BUCKET_NAME);

    if (!bucketExists) {
      console.warn(
        `Storage bucket "${BUCKET_NAME}" does not exist. Please create it in Supabase Dashboard.`,
      );
      return false;
    }

    console.log('Supabase Storage is properly configured');
    return true;
  } catch (error) {
    console.error('Error in checkStorageSetup:', error);
    return false;
  }
}
