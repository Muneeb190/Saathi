import type { RequestHandler } from 'express'

interface RateLimitEntry {
  count: number
  resetAt: number
}

export function createRateLimit(maxRequests: number, windowMs: number): RequestHandler {
  const entries = new Map<string, RateLimitEntry>()
  let nextCleanup = 0

  return (request, response, next) => {
    const now = Date.now()
    if (now >= nextCleanup) {
      for (const [ip, entry] of entries) {
        if (entry.resetAt <= now) entries.delete(ip)
      }
      nextCleanup = now + windowMs
    }

    const ip = request.ip ?? request.socket.remoteAddress ?? 'unknown'
    const entry = entries.get(ip)
    if (entry && entry.resetAt > now && entry.count >= maxRequests) {
      response.set('Retry-After', String(Math.ceil((entry.resetAt - now) / 1000)))
      response.status(429).json({ error: 'Too many requests. Please wait a moment and try again.' })
      return
    }

    if (entry && entry.resetAt > now) {
      entry.count += 1
    } else {
      entries.set(ip, { count: 1, resetAt: now + windowMs })
    }
    next()
  }
}
