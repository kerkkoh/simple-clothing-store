// Upstash Redis Client

import { Redis } from '@upstash/redis';

// Create Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// Helper function to check if Redis is configured
export function isRedisConfigured(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

// Fallback for when Redis is not configured (development/testing)
class MockRedis {
  private store = new Map<string, any>();

  async get<T = any>(key: string): Promise<T | null> {
    return this.store.get(key) || null;
  }

  async set(key: string, value: any): Promise<string> {
    this.store.set(key, value);
    return 'OK';
  }

  async setex(key: string, seconds: number, value: any): Promise<string> {
    this.store.set(key, value);
    // Note: Mock doesn't implement expiration
    return 'OK';
  }

  async del(...keys: string[]): Promise<number> {
    let count = 0;
    keys.forEach((key) => {
      if (this.store.delete(key)) count++;
    });
    return count;
  }

  async sadd(key: string, ...members: string[]): Promise<number> {
    const set = this.store.get(key) || new Set();
    const initialSize = set.size;
    members.forEach((member) => set.add(member));
    this.store.set(key, set);
    return set.size - initialSize;
  }

  async sismember(key: string, member: string): Promise<number> {
    const set = this.store.get(key);
    return set?.has(member) ? 1 : 0;
  }

  async ping(): Promise<string> {
    return 'PONG';
  }
}

// Export appropriate client based on configuration
export const db = isRedisConfigured() ? redis : new MockRedis();

export default redis;
