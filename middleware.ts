import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { checkRateLimit } from '@/lib/rate-limit';

export async function middleware(request: NextRequest) {
  // 1. Enforce Rate Limiting on API endpoints
  if (request.nextUrl.pathname.startsWith('/api')) {
    // Skip rate limiting for internal cron worker and webhooks if needed,
    // or just apply a general generous rate limit
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    
    // 100 requests per minute
    const { success, limit, remaining, reset } = await checkRateLimit(ip, 100, 60);
    
    if (!success) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
          'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
        },
      });
    }
  }

  // 2. Auth Session & Admin Protection
  const response = await updateSession(request);

  // If the rate limit passed, add headers to the successful response
  if (request.nextUrl.pathname.startsWith('/api')) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    // Re-checking here just to get the current values is fast for memory LRU
    // But for production redis we would store the result in a variable
    const { limit, remaining, reset } = await checkRateLimit(ip, 100, 60);
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', reset.toString());
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
