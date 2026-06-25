import { NextRequest, NextResponse } from 'next/server';
import { runAllActiveJobs, runJobById } from '@/lib/cron/runner';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max duration for serverless functions

// Secure the endpoint so only authorized triggers can call it
const CRON_SECRET = process.env.CRON_SECRET || 'vakeel-dev-cron-secret-2026';

function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${CRON_SECRET}`;
}

/**
 * GET /api/cron — Run all active cron jobs (for external cron triggers like Vercel Cron).
 * POST /api/cron — Run a specific job by job_id (for admin "Run Now" actions).
 */
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const results = await runAllActiveJobs();
    return NextResponse.json({ status: 'ok', run_count: results.length, results });
  } catch (err: unknown) {
    return NextResponse.json(
      { status: 'error', error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const jobId = body.job_id;

    if (!jobId) {
      return NextResponse.json({ error: 'job_id is required' }, { status: 400 });
    }

    const result = await runJobById(jobId);

    return NextResponse.json({
      status: result.success ? 'ok' : 'error',
      ...result,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { status: 'error', error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
