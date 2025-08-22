import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

let limiter: Ratelimit | null = null;

export function getLimiter(tokensPerMinute = 30) {
  if (limiter) return limiter;
  const url = import.meta.env.UPSTASH_REDIS_REST_URL;
  const token = import.meta.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    const redis = new Redis({ url, token });
    limiter = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(tokensPerMinute, '1 m') });
  }
  return limiter;
}

export async function limit(identifier: string, tokensPerMinute = 30) {
  const l = getLimiter(tokensPerMinute);
  if (!l) return { success: true };
  return await l.limit(identifier);
}


