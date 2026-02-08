// lib/rateLimit.ts
import { NextResponse } from 'next/server';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
  points: 5, // 5 attempts
  duration: 60, // per 60 seconds
});

export const rateLimit = async (req: Request) => {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  try {
    await rateLimiter.consume(ip);
    return NextResponse.next();
  } catch (error) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }
};