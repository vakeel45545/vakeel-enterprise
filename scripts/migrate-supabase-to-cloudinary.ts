/**
 * Supabase → Cloudinary Migration Script
 * 
 * Safe, incremental migration of existing Supabase Storage assets to Cloudinary.
 * 
 * Flow:
 *   1. Read all media_library records where provider = 'supabase'
 *   2. Download each asset from its current URL
 *   3. Upload to Cloudinary via the provider abstraction
 *   4. Update the DB record with new Cloudinary URLs
 *   5. Verify the new URL is accessible
 *   6. Mark as migrated
 * 
 * Safety:
 *   - Never deletes the original Supabase asset
 *   - Skips already-migrated assets
 *   - Logs every operation
 *   - Can be run multiple times safely (idempotent)
 * 
 * Usage (from project root):
 *   npx tsx scripts/migrate-supabase-to-cloudinary.ts
 */

import { createClient } from '@supabase/supabase-js';
import { v2 as cloudinary } from 'cloudinary';

// ── Configuration ──────────────────────────────────────────

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME!;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY!;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET!;

const DRY_RUN = process.argv.includes('--dry-run');
const BATCH_SIZE = 10;

// ── Setup ──────────────────────────────────────────────────

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

interface MigrationResult {
  total: number;
  migrated: number;
  skipped: number;
  failed: number;
  errors: { id: string; filename: string; error: string }[];
}

// ── Main Migration ─────────────────────────────────────────

async function migrate(): Promise<MigrationResult> {
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║   Supabase → Cloudinary Migration Script        ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log(`Mode: ${DRY_RUN ? '🔍 DRY RUN (no changes)' : '🚀 LIVE MIGRATION'}`);
  console.log('');

  const result: MigrationResult = {
    total: 0,
    migrated: 0,
    skipped: 0,
    failed: 0,
    errors: [],
  };

  // 1. Fetch all Supabase-hosted assets
  const { data: assets, error } = await supabase
    .from('media_library')
    .select('*')
    .eq('provider', 'supabase')
    .neq('status', 'deleted')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('❌ Failed to fetch assets:', error.message);
    return result;
  }

  if (!assets || assets.length === 0) {
    console.log('✅ No Supabase assets to migrate. All clear!');
    return result;
  }

  result.total = assets.length;
  console.log(`Found ${assets.length} Supabase assets to migrate.\n`);

  // 2. Process in batches
  for (let i = 0; i < assets.length; i += BATCH_SIZE) {
    const batch = assets.slice(i, i + BATCH_SIZE);
    console.log(`── Batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} assets) ──`);

    for (const asset of batch) {
      const label = `[${i + batch.indexOf(asset) + 1}/${assets.length}] ${asset.filename}`;

      // Skip if already has a cloudinary_public_id (already migrated)
      if (asset.cloudinary_public_id && asset.provider === 'cloudinary') {
        console.log(`  ⏭️  ${label} — already migrated`);
        result.skipped++;
        continue;
      }

      if (DRY_RUN) {
        console.log(`  🔍 ${label} — would migrate (${formatBytes(asset.size_bytes || 0)})`);
        result.migrated++;
        continue;
      }

      try {
        // 3. Download from current URL
        const response = await fetch(asset.url);
        if (!response.ok) {
          throw new Error(`Download failed: ${response.status} ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 4. Upload to Cloudinary
        const cloudinaryResult = await new Promise<any>((resolve, reject) => {
          const folder = asset.folder || 'vaakil/migrated';
          const resourceType = asset.resource_type === 'video' ? 'video' 
            : asset.resource_type === 'document' ? 'raw' 
            : 'image';

          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder,
              resource_type: resourceType as any,
              public_id: asset.filename?.split('.')[0] || undefined,
            },
            (err, res) => {
              if (err) return reject(err);
              resolve(res);
            }
          );
          uploadStream.end(buffer);
        });

        // 5. Verify the new URL is accessible
        const verifyRes = await fetch(cloudinaryResult.secure_url, { method: 'HEAD' });
        if (!verifyRes.ok) {
          throw new Error(`Verification failed: Cloudinary URL returned ${verifyRes.status}`);
        }

        // 6. Update DB record
        const { error: updateError } = await supabase
          .from('media_library')
          .update({
            provider: 'cloudinary',
            url: cloudinaryResult.secure_url,
            secure_url: cloudinaryResult.secure_url,
            delivery_url: cloudinaryResult.secure_url,
            cloudinary_public_id: cloudinaryResult.public_id,
            cloudinary_version: cloudinaryResult.version?.toString(),
            folder: cloudinaryResult.folder,
            etag: cloudinaryResult.etag,
          })
          .eq('id', asset.id);

        if (updateError) {
          throw new Error(`DB update failed: ${updateError.message}`);
        }

        console.log(`  ✅ ${label} — migrated to ${cloudinaryResult.public_id}`);
        result.migrated++;

      } catch (err: any) {
        console.error(`  ❌ ${label} — FAILED: ${err.message}`);
        result.failed++;
        result.errors.push({ id: asset.id, filename: asset.filename, error: err.message });
      }
    }

    console.log('');
  }

  // Summary
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║   Migration Summary                             ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log(`  Total:    ${result.total}`);
  console.log(`  Migrated: ${result.migrated}`);
  console.log(`  Skipped:  ${result.skipped}`);
  console.log(`  Failed:   ${result.failed}`);

  if (result.errors.length > 0) {
    console.log('\n  Failed assets:');
    for (const e of result.errors) {
      console.log(`    - ${e.filename} (${e.id}): ${e.error}`);
    }
  }

  return result;
}

function formatBytes(bytes: number): string {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// Run
migrate()
  .then((result) => {
    process.exit(result.failed > 0 ? 1 : 0);
  })
  .catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
