import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { GitHubApiClient, GitHubApiError, type Contributor, type ContributorWithFirstCommit, type RateLimitInfo } from './github';

global.fetch = vi.fn();

describe('GitHubApiClient', () => {
  let client: GitHubApiClient;
  const mockFetch = fetch as Mock;

  beforeEach(() => {
    client = new GitHubApiClient();
    vi.clearAllMocks();
  });

  describe('fetchContributors', () => {
    const mockContributors: Contributor[] = [
      {
        id: 1,
        login: 'chrisschwer',
        avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
        html_url: 'https://github.com/chrisschwer',
        contributions: 10,
        type: 'User'
      },
      {
        id: 2,
        login: 'contributor2',
        avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4',
        html_url: 'https://github.com/contributor2',
        contributions: 5,
        type: 'User'
      }
    ];

    it('should fetch contributors successfully', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockContributors)
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([{
            commit: { author: { date: '2024-01-01T10:00:00Z' } }
          }])
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([{
            commit: { author: { date: '2024-01-01T10:00:00Z' } }
          }])
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([{
            commit: { author: { date: '2024-01-02T10:00:00Z' } }
          }])
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([{
            commit: { author: { date: '2024-01-02T10:00:00Z' } }
          }])
        });

      const result = await client.fetchContributors();

      expect(result).toHaveLength(2);
      expect(result[0].login).toBe('chrisschwer');
      expect(result[0].first_commit_date).toBe('2024-01-01T10:00:00Z');
      expect(result[1].login).toBe('contributor2');
    });

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: () => Promise.resolve({ message: 'Repository not found' })
      });

      await expect(client.fetchContributors()).rejects.toThrow(GitHubApiError);
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(client.fetchContributors()).rejects.toThrow(GitHubApiError);
    });
  });

  describe('makeRequest with retry logic', () => {
    it('should retry on 500 errors', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error'
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([])
        });

      const result = await client.fetchContributors();
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should handle rate limiting with detailed error', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 403,
          json: () => Promise.resolve({ message: 'Rate limit exceeded' })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            rate: { remaining: 0, reset: Math.floor(Date.now() / 1000) + 3600 }
          })
        });

      await expect(client.fetchContributors()).rejects.toThrow('Rate limit exceeded');
    });
  });

  describe('getRateLimitInfo', () => {
    it('should return rate limit information', async () => {
      const mockRateLimit: RateLimitInfo = {
        limit: 5000,
        remaining: 4999,
        reset: Math.floor(Date.now() / 1000) + 3600,
        used: 1
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ rate: mockRateLimit })
      });

      const result = await client.getRateLimitInfo();
      expect(result).toEqual(mockRateLimit);
    });

    it('should return null on error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await client.getRateLimitInfo();
      expect(result).toBeNull();
    });
  });

  describe('isRateLimited', () => {
    it('should return true when rate limited', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          rate: { remaining: 0 }
        })
      });

      const result = await client.isRateLimited();
      expect(result).toBe(true);
    });

    it('should return false when not rate limited', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          rate: { remaining: 100 }
        })
      });

      const result = await client.isRateLimited();
      expect(result).toBe(false);
    });
  });

  describe('getContributors', () => {
    it('should provide helpful error messages for different status codes', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: () => Promise.resolve({ message: 'Forbidden' })
      });

      await expect(client.getContributors()).rejects.toThrow(
        'Access denied. The repository may be private or rate limit exceeded.'
      );
    });

    it('should handle 404 errors with helpful message', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'Not Found' })
      });

      await expect(client.getContributors()).rejects.toThrow(
        'Repository not found. Please check the repository name and access permissions.'
      );
    });

    it('should handle server errors with helpful message', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 502,
          json: () => Promise.resolve({ message: 'Bad Gateway' })
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 502,
          json: () => Promise.resolve({ message: 'Bad Gateway' })
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 502,
          json: () => Promise.resolve({ message: 'Bad Gateway' })
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 502,
          json: () => Promise.resolve({ message: 'Bad Gateway' })
        });

      await expect(client.getContributors()).rejects.toThrow(
        'GitHub API is currently unavailable. Please try again later.'
      );
    });
  });

  describe('getContributorsWithFallback', () => {
    it('should return fallback data when API fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await client.getContributorsWithFallback();

      expect(result).toHaveLength(1);
      expect(result[0].login).toBe('chrisschwer');
      expect(result[0].avatar_url).toBe('https://github.com/chrisschwer.png');
    });

    it('should return API data when successful', async () => {
      const mockContributors: Contributor[] = [
        {
          id: 1,
          login: 'chrisschwer',
          avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
          html_url: 'https://github.com/chrisschwer',
          contributions: 10,
          type: 'User'
        }
      ];

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockContributors)
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([{
            commit: { author: { date: '2024-01-01T10:00:00Z' } }
          }])
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([{
            commit: { author: { date: '2024-01-01T10:00:00Z' } }
          }])
        });

      const result = await client.getContributorsWithFallback();
      expect(result[0].login).toBe('chrisschwer');
      expect(result[0].first_commit_date).toBe('2024-01-01T10:00:00Z');
    });
  });

  describe('transformToDisplayData', () => {
    it('should transform contributors to display format', () => {
      const contributors: ContributorWithFirstCommit[] = [
        {
          id: 1,
          login: 'chrisschwer',
          avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
          html_url: 'https://github.com/chrisschwer',
          contributions: 10,
          type: 'User',
          first_commit_date: '2024-01-01T10:00:00Z'
        },
        {
          id: 2,
          login: 'contributor2',
          avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4',
          html_url: 'https://github.com/contributor2',
          contributions: 5,
          type: 'User',
          first_commit_date: '2024-01-02T10:00:00Z'
        }
      ];

      const result = client.transformToDisplayData(contributors);

      expect(result).toHaveLength(2);
      expect(result[0].isOwner).toBe(true);
      expect(result[1].isOwner).toBe(false);
      expect(result[0].name).toBe('chrisschwer');
      expect(result[1].name).toBe('contributor2');
    });
  });

  describe('getContributorsForDisplay', () => {
    it('should return display-ready contributor data', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await client.getContributorsForDisplay();

      expect(result).toHaveLength(1);
      expect(result[0].login).toBe('chrisschwer');
      expect(result[0].isOwner).toBe(true);
      expect(result[0].name).toBe('chrisschwer');
    });
  });

  describe('contributor sorting', () => {
    it('should sort contributors with owner first, then by first commit date', async () => {
      const contributors: Contributor[] = [
        {
          id: 2,
          login: 'contributor2',
          avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4',
          html_url: 'https://github.com/contributor2',
          contributions: 5,
          type: 'User'
        },
        {
          id: 1,
          login: 'chrisschwer',
          avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
          html_url: 'https://github.com/chrisschwer',
          contributions: 10,
          type: 'User'
        },
        {
          id: 3,
          login: 'contributor3',
          avatar_url: 'https://avatars.githubusercontent.com/u/3?v=4',
          html_url: 'https://github.com/contributor3',
          contributions: 3,
          type: 'User'
        }
      ];

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(contributors)
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([{
            commit: { author: { date: '2024-01-03T10:00:00Z' } }
          }])
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([{
            commit: { author: { date: '2024-01-03T10:00:00Z' } }
          }])
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([{
            commit: { author: { date: '2024-01-01T10:00:00Z' } }
          }])
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([{
            commit: { author: { date: '2024-01-01T10:00:00Z' } }
          }])
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([{
            commit: { author: { date: '2024-01-02T10:00:00Z' } }
          }])
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([{
            commit: { author: { date: '2024-01-02T10:00:00Z' } }
          }])
        });

      const result = await client.fetchContributors();

      expect(result[0].login).toBe('chrisschwer');
      expect(result[1].first_commit_date).toBe('2024-01-02T10:00:00Z');
      expect(result[2].first_commit_date).toBe('2024-01-03T10:00:00Z');
    });
  });
});

describe('GitHubApiError', () => {
  it('should create error with message and status', () => {
    const error = new GitHubApiError('Test error', 404);
    
    expect(error.message).toBe('Test error');
    expect(error.status).toBe(404);
    expect(error.name).toBe('GitHubApiError');
  });

  it('should include documentation URL when provided', () => {
    const error = new GitHubApiError('Test error', 403, 'https://docs.github.com');
    
    expect(error.documentation_url).toBe('https://docs.github.com');
  });
});