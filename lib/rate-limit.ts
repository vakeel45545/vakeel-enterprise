/**
 * Simple in-memory rate limiter.
 * Note: In a true Vercel serverless environment, memory is isolated per container.
 * For production with thousands of concurrent users across edge nodes, replace this
 * with @upstash/ratelimit (Redis). This serves as a solid baseline protection.
 */

type RateLimitInfo = {
  count: number;
  resetTime: number;
};

// Global map to hold rate limits
const rateLimitMap = new Map<string, RateLimitInfo>();

export async function checkRateLimit(
  identifier: string,
  limit: number = 100,
  windowSeconds: number = 60
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const now = Date.now();
  const resetTime = now + windowSeconds * 1000;
  
  // Cleanup old entries randomly to prevent memory leak
  if (Math.random() < 0.05) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (val.resetTime < now) {
        rateLimitMap.delete(key);
      }
    }
  }

  const current = rateLimitMap.get(identifier);

  if (!current || current.resetTime < now) {
    rateLimitMap.set(identifier, { count: 1, resetTime });
    return { success: true, limit, remaining: limit - 1, reset: resetTime };
  }

  if (current.count >= limit) {
    return { success: false, limit, remaining: 0, reset: current.resetTime };
  }

  current.count += 1;
  return { success: true, limit, remaining: limit - current.count, reset: current.resetTime };
}
