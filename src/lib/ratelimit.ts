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

// 5 submissions per IP per hour — military discount application form
export const militaryDiscountLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '1 h'), prefix: 'rl:military' })
  : null

// 30 attempts per IP per 10 minutes — coupon code verification (prevents enumeration)
export const couponVerifyLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, '10 m'), prefix: 'rl:coupon' })
  : null

export function getIp(headers: Headers): string {
  return headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'
}
