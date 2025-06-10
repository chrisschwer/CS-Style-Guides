import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import { FileCache, cache, getOrSet, cache24Hours, isCacheOlderThan } from './cache';

// Mock fs module
vi.mock('fs/promises');

describe('FileCache', () => {
  let fileCache: FileCache;
  const testCacheDir = '.test-cache';
  
  beforeEach(() => {
    vi.clearAllMocks();
    fileCache = new FileCache(testCacheDir);
    // Mock Date.now() for consistent testing
    vi.spyOn(Date, 'now').mockReturnValue(1000000);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('ensureCacheDir', () => {
    it('should create cache directory if it does not exist', async () => {
      const mkdirSpy = vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      
      await fileCache.write('test-key', { data: 'test' });
      
      expect(mkdirSpy).toHaveBeenCalledWith(testCacheDir, { recursive: true });
    });

    it('should handle directory creation errors', async () => {
      vi.mocked(fs.mkdir).mockRejectedValue(new Error('Permission denied'));
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);
      
      await expect(fileCache.write('test-key', { data: 'test' })).rejects.toThrow('Permission denied');
    });
  });

  describe('write', () => {
    beforeEach(() => {
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);
    });

    it('should write data to cache with metadata', async () => {
      const testData = { name: 'John', age: 30 };
      
      await fileCache.write('user-data', testData);
      
      const expectedPath = path.join(testCacheDir, 'user-data.json');
      const writeFileSpy = vi.mocked(fs.writeFile);
      
      expect(writeFileSpy).toHaveBeenCalledWith(
        expectedPath,
        expect.stringContaining('"name":"John"'),
        'utf-8'
      );
      
      const writtenData = JSON.parse(writeFileSpy.mock.calls[0][1] as string);
      expect(writtenData.data).toEqual(testData);
      expect(writtenData.metadata.timestamp).toBe(1000000);
      expect(writtenData.metadata.expiresIn).toBeUndefined();
    });

    it('should write data with expiration time', async () => {
      const testData = { value: 42 };
      const expiresIn = 3600000; // 1 hour
      
      await fileCache.write('temp-data', testData, { expiresIn });
      
      const writeFileSpy = vi.mocked(fs.writeFile);
      const writtenData = JSON.parse(writeFileSpy.mock.calls[0][1] as string);
      
      expect(writtenData.metadata.expiresIn).toBe(expiresIn);
    });

    it('should sanitize cache keys', async () => {
      await fileCache.write('my/dangerous\\key:file', { data: 'test' });
      
      const expectedPath = path.join(testCacheDir, 'my-dangerous-key-file.json');
      expect(vi.mocked(fs.writeFile)).toHaveBeenCalledWith(
        expectedPath,
        expect.any(String),
        'utf-8'
      );
    });

    it('should handle write errors', async () => {
      vi.mocked(fs.writeFile).mockRejectedValue(new Error('Disk full'));
      
      await expect(fileCache.write('test-key', { data: 'test' })).rejects.toThrow(
        'Failed to write cache for key "test-key": Error: Disk full'
      );
    });
  });

  describe('read', () => {
    beforeEach(() => {
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
    });

    it('should read cached data', async () => {
      const cachedData = {
        data: { name: 'John', age: 30 },
        metadata: { timestamp: 1000000 }
      };
      
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(cachedData));
      
      const result = await fileCache.read('user-data');
      
      expect(result).toEqual(cachedData.data);
      expect(vi.mocked(fs.readFile)).toHaveBeenCalledWith(
        path.join(testCacheDir, 'user-data.json'),
        'utf-8'
      );
    });

    it('should return null for non-existent cache', async () => {
      const error = new Error('File not found') as NodeJS.ErrnoException;
      error.code = 'ENOENT';
      vi.mocked(fs.readFile).mockRejectedValue(error);
      
      const result = await fileCache.read('non-existent');
      
      expect(result).toBeNull();
    });

    it('should return null for expired cache', async () => {
      const cachedData = {
        data: { value: 42 },
        metadata: { 
          timestamp: 500000, // Old timestamp
          expiresIn: 100000  // Already expired
        }
      };
      
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(cachedData));
      
      const result = await fileCache.read('expired-data');
      
      expect(result).toBeNull();
    });

    it('should return data for non-expired cache', async () => {
      const cachedData = {
        data: { value: 42 },
        metadata: { 
          timestamp: 900000,
          expiresIn: 200000 // Not expired yet
        }
      };
      
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(cachedData));
      
      const result = await fileCache.read('valid-data');
      
      expect(result).toEqual(cachedData.data);
    });

    it('should handle JSON parse errors', async () => {
      vi.mocked(fs.readFile).mockResolvedValue('invalid json');
      
      const result = await fileCache.read('corrupted-data');
      
      expect(result).toBeNull();
    });
  });

  describe('exists', () => {
    it('should return true for existing valid cache', async () => {
      const cachedData = {
        data: { value: 42 },
        metadata: { timestamp: 1000000 }
      };
      
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(cachedData));
      
      const result = await fileCache.exists('test-key');
      
      expect(result).toBe(true);
    });

    it('should return false for non-existent cache', async () => {
      const error = new Error('File not found') as NodeJS.ErrnoException;
      error.code = 'ENOENT';
      vi.mocked(fs.readFile).mockRejectedValue(error);
      
      const result = await fileCache.exists('non-existent');
      
      expect(result).toBe(false);
    });

    it('should return false for expired cache', async () => {
      const cachedData = {
        data: { value: 42 },
        metadata: { 
          timestamp: 500000,
          expiresIn: 100000
        }
      };
      
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(cachedData));
      
      const result = await fileCache.exists('expired-data');
      
      expect(result).toBe(false);
    });
  });

  describe('getTimestamp', () => {
    it('should return timestamp for existing cache', async () => {
      const cachedData = {
        data: { value: 42 },
        metadata: { timestamp: 999999 }
      };
      
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(cachedData));
      
      const result = await fileCache.getTimestamp('test-key');
      
      expect(result).toBe(999999);
    });

    it('should return null for non-existent cache', async () => {
      vi.mocked(fs.readFile).mockRejectedValue(new Error('File not found'));
      
      const result = await fileCache.getTimestamp('non-existent');
      
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete existing cache file', async () => {
      vi.mocked(fs.unlink).mockResolvedValue(undefined);
      
      await fileCache.delete('test-key');
      
      expect(vi.mocked(fs.unlink)).toHaveBeenCalledWith(
        path.join(testCacheDir, 'test-key.json')
      );
    });

    it('should not throw error for non-existent file', async () => {
      const error = new Error('File not found') as NodeJS.ErrnoException;
      error.code = 'ENOENT';
      vi.mocked(fs.unlink).mockRejectedValue(error);
      
      await expect(fileCache.delete('non-existent')).resolves.not.toThrow();
    });

    it('should throw error for other delete failures', async () => {
      vi.mocked(fs.unlink).mockRejectedValue(new Error('Permission denied'));
      
      await expect(fileCache.delete('test-key')).rejects.toThrow(
        'Failed to delete cache for key "test-key": Error: Permission denied'
      );
    });
  });

  describe('clear', () => {
    it('should delete all cache files', async () => {
      const mockFiles = ['cache1.json', 'cache2.json', 'other.txt'];
      vi.mocked(fs.readdir).mockResolvedValue(mockFiles as any);
      vi.mocked(fs.unlink).mockResolvedValue(undefined);
      
      await fileCache.clear();
      
      expect(vi.mocked(fs.unlink)).toHaveBeenCalledTimes(2);
      expect(vi.mocked(fs.unlink)).toHaveBeenCalledWith(path.join(testCacheDir, 'cache1.json'));
      expect(vi.mocked(fs.unlink)).toHaveBeenCalledWith(path.join(testCacheDir, 'cache2.json'));
      expect(vi.mocked(fs.unlink)).not.toHaveBeenCalledWith(path.join(testCacheDir, 'other.txt'));
    });

    it('should not throw error if directory does not exist', async () => {
      const error = new Error('Directory not found') as NodeJS.ErrnoException;
      error.code = 'ENOENT';
      vi.mocked(fs.readdir).mockRejectedValue(error);
      
      await expect(fileCache.clear()).resolves.not.toThrow();
    });

    it('should throw error for other clear failures', async () => {
      vi.mocked(fs.readdir).mockRejectedValue(new Error('Permission denied'));
      
      await expect(fileCache.clear()).rejects.toThrow(
        'Failed to clear cache: Error: Permission denied'
      );
    });
  });

  describe('getCacheFilePath', () => {
    it('should return correct cache file path', () => {
      const result = fileCache.getCacheFilePath('test-key');
      
      expect(result).toBe(path.join(testCacheDir, 'test-key.json'));
    });

    it('should sanitize file names', () => {
      const result = fileCache.getCacheFilePath('../../etc/passwd');
      
      expect(result).toBe(path.join(testCacheDir, '-----etc-passwd.json'));
    });
  });
});

describe('Helper Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(Date, 'now').mockReturnValue(1000000);
    vi.mocked(fs.mkdir).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getOrSet', () => {
    it('should return cached data if available', async () => {
      const cachedData = {
        data: { value: 'cached' },
        metadata: { timestamp: 1000000 }
      };
      
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(cachedData));
      
      const factory = vi.fn().mockResolvedValue({ value: 'new' });
      const result = await getOrSet('test-key', factory);
      
      expect(result).toEqual({ value: 'cached' });
      expect(factory).not.toHaveBeenCalled();
    });

    it('should call factory and cache result if not cached', async () => {
      const error = new Error('File not found') as NodeJS.ErrnoException;
      error.code = 'ENOENT';
      vi.mocked(fs.readFile).mockRejectedValue(error);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);
      
      const factory = vi.fn().mockResolvedValue({ value: 'new' });
      const result = await getOrSet('test-key', factory);
      
      expect(result).toEqual({ value: 'new' });
      expect(factory).toHaveBeenCalled();
      expect(vi.mocked(fs.writeFile)).toHaveBeenCalled();
    });

    it('should work with synchronous factory', async () => {
      const error = new Error('File not found') as NodeJS.ErrnoException;
      error.code = 'ENOENT';
      vi.mocked(fs.readFile).mockRejectedValue(error);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);
      
      const factory = () => ({ value: 'sync' });
      const result = await getOrSet('test-key', factory);
      
      expect(result).toEqual({ value: 'sync' });
    });

    it('should pass options to cache write', async () => {
      const error = new Error('File not found') as NodeJS.ErrnoException;
      error.code = 'ENOENT';
      vi.mocked(fs.readFile).mockRejectedValue(error);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);
      
      const factory = vi.fn().mockResolvedValue({ value: 'new' });
      await getOrSet('test-key', factory, { expiresIn: 3600000 });
      
      const writeFileSpy = vi.mocked(fs.writeFile);
      const writtenData = JSON.parse(writeFileSpy.mock.calls[0][1] as string);
      
      expect(writtenData.metadata.expiresIn).toBe(3600000);
    });
  });

  describe('cache24Hours', () => {
    it('should cache data with 24-hour expiration', async () => {
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);
      
      await cache24Hours('daily-data', { value: 'test' });
      
      const writeFileSpy = vi.mocked(fs.writeFile);
      const writtenData = JSON.parse(writeFileSpy.mock.calls[0][1] as string);
      
      expect(writtenData.data).toEqual({ value: 'test' });
      expect(writtenData.metadata.expiresIn).toBe(24 * 60 * 60 * 1000);
    });
  });

  describe('isCacheOlderThan', () => {
    it('should return true if cache is older than specified hours', async () => {
      const oldTimestamp = 1000000 - (25 * 60 * 60 * 1000); // 25 hours ago
      const cachedData = {
        data: { value: 42 },
        metadata: { timestamp: oldTimestamp }
      };
      
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(cachedData));
      
      const result = await isCacheOlderThan('test-key', 24);
      
      expect(result).toBe(true);
    });

    it('should return false if cache is newer than specified hours', async () => {
      const recentTimestamp = 1000000 - (20 * 60 * 60 * 1000); // 20 hours ago
      const cachedData = {
        data: { value: 42 },
        metadata: { timestamp: recentTimestamp }
      };
      
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(cachedData));
      
      const result = await isCacheOlderThan('test-key', 24);
      
      expect(result).toBe(false);
    });

    it('should return true if cache does not exist', async () => {
      const error = new Error('File not found') as NodeJS.ErrnoException;
      error.code = 'ENOENT';
      vi.mocked(fs.readFile).mockRejectedValue(error);
      
      const result = await isCacheOlderThan('non-existent', 24);
      
      expect(result).toBe(true);
    });
  });
});

// Integration test with default cache instance
describe('Default Cache Instance', () => {
  it('should use default .cache directory', async () => {
    vi.mocked(fs.mkdir).mockResolvedValue(undefined);
    vi.mocked(fs.writeFile).mockResolvedValue(undefined);
    
    await cache.write('test', { data: 'test' });
    
    expect(vi.mocked(fs.mkdir)).toHaveBeenCalledWith('.cache', { recursive: true });
    expect(vi.mocked(fs.writeFile)).toHaveBeenCalledWith(
      path.join('.cache', 'test.json'),
      expect.any(String),
      'utf-8'
    );
  });
});