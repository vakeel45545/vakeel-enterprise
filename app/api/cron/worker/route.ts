import { NextRequest, NextResponse } from 'next/server';
import { runJobById } from '@/lib/cron/runner';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // Full 5 minutes allowed for a single job run

const CRON_SECRET = process.env.CRON_SECRET || 'vakeel-dev-cron-secret-2026';

function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${CRON_SECRET}`;
}

/**
 * POST /api/cron/worker
 * Receives a job_id from the fan-out dispatcher and executes it independently.
 * This ensures long-running jobs (e.g. blog generation) do not time out
 * waiting for other jobs in the queue.
 */
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

    // This handles DB logging internally inside the runner
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
