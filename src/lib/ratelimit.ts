import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

function makeRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null
  }
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
}

const redis = makeRedis()

// Fail-secure stub: blocks all requests in production when Redis is unavailable,
// allows in dev so local work isn't broken.
const DENY_ALL = {
  limit: async (_key: string) => ({ success: false }),
} as unknown as Ratelimit

function makeSecureLimiter(limiter: Ratelimit.Algorithm, prefix: string): Ratelimit | null {
  if (redis) return new Ratelimit({ redis, limiter, prefix })
  return process.env.NODE_ENV === 'production' ? DENY_ALL : null
}

// 5 submissions per IP per hour — military discount application form
export const militaryDiscountLimiter = makeSecureLimiter(
  Ratelimit.slidingWindow(5, '1 h'),
  'rl:military',
)

// 5 attempts per IP per 10 minutes — coupon code verification (prevents enumeration)
export const couponVerifyLimiter = makeSecureLimiter(
  Ratelimit.slidingWindow(5, '10 m'),
  'rl:coupon',
)

export function getIp(headers: Headers): string {
  return headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'
}
