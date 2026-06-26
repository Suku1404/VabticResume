import crypto from "crypto";

interface CacheEntry<T> {
  value: T;
  expiry: number;
}

export class AICacheService {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTLMs: number;

  constructor(defaultTTLMinutes = 15) {
    this.defaultTTLMs = defaultTTLMinutes * 60 * 1000;
  }

  /**
   * Generates a unique cache key based on inputs (e.g. prompt, data)
   */
  public generateKey(inputs: any[]): string {
    const serialized = JSON.stringify(inputs);
    return crypto.createHash("sha256").update(serialized).digest("hex");
  }

  /**
   * Gets a cached item if it exists and has not expired
   */
  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  /**
   * Caches an item with a specific key and optional custom TTL
   */
  public set<T>(key: string, value: T, ttlMs?: number): void {
    const duration = ttlMs !== undefined ? ttlMs : this.defaultTTLMs;
    this.cache.set(key, {
      value,
      expiry: Date.now() + duration,
    });
  }

  /**
   * Clears the entire cache
   */
  public clear(): void {
    this.cache.clear();
  }
}

export const aiCacheService = new AICacheService();
