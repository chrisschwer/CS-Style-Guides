import fs from 'fs/promises';
import path from 'path';

/**
 * Interface for cache entry metadata
 */
interface CacheMetadata {
  /** Unix timestamp when the cache was created */
  timestamp: number;
  /** Optional expiration time in milliseconds */
  expiresIn?: number;
}

/**
 * Interface for a cache entry with data and metadata
 */
interface CacheEntry<T> {
  /** The cached data */
  data: T;
  /** Metadata about the cache entry */
  metadata: CacheMetadata;
}

/**
 * Options for cache operations
 */
interface CacheOptions {
  /** Time in milliseconds until cache expires (optional) */
  expiresIn?: number;
}

/**
 * File-based caching utility for storing JSON-serializable data
 */
export class FileCache {
  private cacheDir: string;

  /**
   * Creates a new FileCache instance
   * @param cacheDir - Directory where cache files will be stored (default: .cache)
   */
  constructor(cacheDir = '.cache') {
    this.cacheDir = cacheDir;
  }

  /**
   * Ensures the cache directory exists
   */
  private async ensureCacheDir(): Promise<void> {
    try {
      await fs.mkdir(this.cacheDir, { recursive: true });
    } catch (error) {
      throw new Error(`Failed to create cache directory: ${error}`);
    }
  }

  /**
   * Gets the file path for a cache key
   * @param key - The cache key
   * @returns The full path to the cache file
   */
  getCacheFilePath(key: string): string {
    // Sanitize the key to ensure it's a valid filename
    const sanitizedKey = key.replace(/[^a-zA-Z0-9-_]/g, '_');
    return path.join(this.cacheDir, `${sanitizedKey}.json`);
  }

  /**
   * Writes data to cache with the specified key
   * @param key - The cache key
   * @param data - The data to cache (must be JSON-serializable)
   * @param options - Optional cache options
   * @throws Error if write operation fails
   */
  async write<T>(key: string, data: T, options?: CacheOptions): Promise<void> {
    try {
      await this.ensureCacheDir();

      const cacheEntry: CacheEntry<T> = {
        data,
        metadata: {
          timestamp: Date.now(),
          expiresIn: options?.expiresIn
        }
      };

      const filePath = this.getCacheFilePath(key);
      await fs.writeFile(filePath, JSON.stringify(cacheEntry, null, 2), 'utf-8');
    } catch (error) {
      throw new Error(`Failed to write cache for key "${key}": ${error}`);
    }
  }

  /**
   * Reads cached data by key
   * @param key - The cache key
   * @returns The cached data or null if not found or expired
   */
  async read<T>(key: string): Promise<T | null> {
    try {
      const filePath = this.getCacheFilePath(key);
      const content = await fs.readFile(filePath, 'utf-8');
      const cacheEntry: CacheEntry<T> = JSON.parse(content);

      // Check if cache is expired
      if (this.isExpired(cacheEntry.metadata)) {
        await this.delete(key);
        return null;
      }

      return cacheEntry.data;
    } catch (error) {
      // Return null for file not found or parse errors
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }
      throw new Error(`Failed to read cache for key "${key}": ${error}`);
    }
  }

  /**
   * Checks if cache exists and is valid for the given key
   * @param key - The cache key
   * @returns True if cache exists and is valid, false otherwise
   */
  async exists(key: string): Promise<boolean> {
    try {
      const filePath = this.getCacheFilePath(key);
      const stats = await fs.stat(filePath);
      
      if (!stats.isFile()) {
        return false;
      }

      // Read the file to check expiration
      const content = await fs.readFile(filePath, 'utf-8');
      const cacheEntry: CacheEntry<unknown> = JSON.parse(content);

      return !this.isExpired(cacheEntry.metadata);
    } catch (error) {
      return false;
    }
  }

  /**
   * Gets the timestamp when the cache was created
   * @param key - The cache key
   * @returns The timestamp or null if cache doesn't exist
   */
  async getTimestamp(key: string): Promise<number | null> {
    try {
      const filePath = this.getCacheFilePath(key);
      const content = await fs.readFile(filePath, 'utf-8');
      const cacheEntry: CacheEntry<unknown> = JSON.parse(content);
      return cacheEntry.metadata.timestamp;
    } catch (error) {
      return null;
    }
  }

  /**
   * Deletes a cache entry
   * @param key - The cache key
   */
  async delete(key: string): Promise<void> {
    try {
      const filePath = this.getCacheFilePath(key);
      await fs.unlink(filePath);
    } catch (error) {
      // Ignore file not found errors
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw new Error(`Failed to delete cache for key "${key}": ${error}`);
      }
    }
  }

  /**
   * Clears all cache entries
   */
  async clear(): Promise<void> {
    try {
      const files = await fs.readdir(this.cacheDir);
      const deletePromises = files
        .filter(file => file.endsWith('.json'))
        .map(file => fs.unlink(path.join(this.cacheDir, file)));
      
      await Promise.all(deletePromises);
    } catch (error) {
      // Ignore if directory doesn't exist
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw new Error(`Failed to clear cache: ${error}`);
      }
    }
  }

  /**
   * Checks if a cache entry is expired based on its metadata
   * @param metadata - The cache metadata
   * @returns True if expired, false otherwise
   */
  private isExpired(metadata: CacheMetadata): boolean {
    if (!metadata.expiresIn) {
      return false;
    }

    const now = Date.now();
    const expirationTime = metadata.timestamp + metadata.expiresIn;
    return now > expirationTime;
  }
}

/**
 * Default cache instance for convenience
 */
export const cache = new FileCache();

/**
 * Helper function to get or set cache with a factory function
 * @param key - The cache key
 * @param factory - Function to generate data if not in cache
 * @param options - Optional cache options
 * @returns The cached or newly generated data
 */
export async function getOrSet<T>(
  key: string,
  factory: () => Promise<T> | T,
  options?: CacheOptions
): Promise<T> {
  const cached = await cache.read<T>(key);
  
  if (cached !== null) {
    return cached;
  }

  const data = await factory();
  await cache.write(key, data, options);
  return data;
}

/**
 * Helper to create cache with 24-hour expiration
 * @param key - The cache key
 * @param data - The data to cache
 */
export async function cache24Hours<T>(key: string, data: T): Promise<void> {
  await cache.write(key, data, { expiresIn: 24 * 60 * 60 * 1000 });
}

/**
 * Helper to check if cache is older than specified hours
 * @param key - The cache key
 * @param hours - Number of hours to check against
 * @returns True if cache is older than specified hours or doesn't exist
 */
export async function isCacheOlderThan(key: string, hours: number): Promise<boolean> {
  const timestamp = await cache.getTimestamp(key);
  
  if (!timestamp) {
    return true;
  }

  const ageInHours = (Date.now() - timestamp) / (1000 * 60 * 60);
  return ageInHours > hours;
}