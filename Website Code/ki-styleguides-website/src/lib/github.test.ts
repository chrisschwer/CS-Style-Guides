import { describe, it, expect, beforeEach, vi, Mock, afterEach } from 'vitest';
import { 
  GitHubApiClient, 
  GitHubApiError, 
  readExclusionsFile,
  filterExcludedContributors,
  getAllOptOutExclusions,
  type Contributor, 
  type ContributorWithFirstCommit, 
  type RateLimitInfo,
  type GitHubIssue
} from './github';
import fs from 'fs/promises';

// Mock fs module
vi.mock('fs/promises');

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

describe('Opt-out functionality', () => {
  const mockFetch = fetch as Mock;
  
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('readExclusionsFile', () => {
    it('should read and parse exclusions file correctly', async () => {
      const mockContent = `# Contributors who have opted out
# This is a comment

user1
user2
# Another comment
USER3

`;
      
      vi.mocked(fs.readFile).mockResolvedValue(mockContent);
      
      const result = await readExclusionsFile('.contributors-exclusions');
      
      expect(result).toEqual(['user1', 'user2', 'user3']);
    });

    it('should return empty array when file does not exist', async () => {
      const error = new Error('File not found') as NodeJS.ErrnoException;
      error.code = 'ENOENT';
      vi.mocked(fs.readFile).mockRejectedValue(error);
      
      const result = await readExclusionsFile('.contributors-exclusions');
      
      expect(result).toEqual([]);
    });

    it('should return empty array on other errors', async () => {
      vi.mocked(fs.readFile).mockRejectedValue(new Error('Permission denied'));
      
      const result = await readExclusionsFile('.contributors-exclusions');
      
      expect(result).toEqual([]);
    });

    it('should remove duplicates and convert to lowercase', async () => {
      const mockContent = `user1
USER1
User1
user2
`;
      
      vi.mocked(fs.readFile).mockResolvedValue(mockContent);
      
      const result = await readExclusionsFile('.contributors-exclusions');
      
      expect(result).toEqual(['user1', 'user2']);
    });
  });

  describe('filterExcludedContributors', () => {
    const mockContributors: ContributorWithFirstCommit[] = [
      {
        id: 1,
        login: 'user1',
        avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
        html_url: 'https://github.com/user1',
        contributions: 10,
        type: 'User'
      },
      {
        id: 2,
        login: 'USER2',
        avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4',
        html_url: 'https://github.com/user2',
        contributions: 5,
        type: 'User'
      },
      {
        id: 3,
        login: 'user3',
        avatar_url: 'https://avatars.githubusercontent.com/u/3?v=4',
        html_url: 'https://github.com/user3',
        contributions: 3,
        type: 'User'
      }
    ];

    it('should filter out excluded contributors', () => {
      const exclusions = ['user1', 'user2'];
      
      const result = filterExcludedContributors(mockContributors, exclusions);
      
      expect(result).toHaveLength(1);
      expect(result[0].login).toBe('user3');
    });

    it('should handle case-insensitive matching', () => {
      const exclusions = ['user2']; // lowercase
      
      const result = filterExcludedContributors(mockContributors, exclusions);
      
      expect(result).toHaveLength(2);
      expect(result.find(c => c.login === 'USER2')).toBeUndefined();
    });

    it('should return all contributors when no exclusions', () => {
      const result = filterExcludedContributors(mockContributors, []);
      
      expect(result).toEqual(mockContributors);
    });
  });

  describe('searchOptOutIssues', () => {
    let client: GitHubApiClient;

    beforeEach(() => {
      client = new GitHubApiClient('owner', 'repo');
      vi.clearAllMocks();
    });

    it('should find opt-out requests by labels', async () => {
      const mockIssues: GitHubIssue[] = [
        {
          id: 1,
          number: 123,
          title: 'Please opt me out',
          body: 'I would like to opt out',
          state: 'open',
          labels: [{ id: 1, name: 'opt-out', color: 'ff0000' }],
          user: { login: 'user1', id: 1 },
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockIssues)
      });

      // Mock empty responses for other default labels and keywords
      for (let i = 0; i < 5; i++) {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(i < 2 ? [] : { items: [] })
        });
      }

      const result = await client.searchOptOutIssues();
      
      expect(result).toContain('user1');
    });

    it('should find opt-out requests by keywords in title', async () => {
      const mockSearchResult = {
        items: [
          {
            id: 2,
            number: 456,
            title: 'Please opt out my account',
            body: 'Thanks',
            state: 'open',
            labels: [],
            user: { login: 'user2', id: 2 },
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          }
        ]
      };

      // Mock empty responses for labels
      for (let i = 0; i < 3; i++) {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([])
        });
      }

      // Mock search results
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSearchResult)
      });

      // Mock empty responses for remaining keywords
      for (let i = 0; i < 2; i++) {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ items: [] })
        });
      }

      const result = await client.searchOptOutIssues();
      
      expect(result).toContain('user2');
    });

    it('should deduplicate users found through multiple methods', async () => {
      const mockIssues: GitHubIssue[] = [
        {
          id: 1,
          number: 123,
          title: 'Opt-out request',
          body: null,
          state: 'open',
          labels: [{ id: 1, name: 'opt-out', color: 'ff0000' }],
          user: { login: 'USER1', id: 1 },
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ];

      const mockSearchResult = {
        items: [
          {
            id: 2,
            number: 456,
            title: 'Please exclude me from contributors',
            body: 'I want to opt out',
            state: 'open',
            labels: [],
            user: { login: 'user1', id: 1 },
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockIssues)
      });

      // Mock empty responses for other labels
      for (let i = 0; i < 2; i++) {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([])
        });
      }

      // Mock search results
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSearchResult)
      });

      // Mock empty responses for remaining keywords
      for (let i = 0; i < 2; i++) {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ items: [] })
        });
      }

      const result = await client.searchOptOutIssues();
      
      expect(result).toHaveLength(1);
      expect(result).toContain('user1');
    });
  });

  describe('scanRepositoryOptOutFiles', () => {
    let client: GitHubApiClient;

    beforeEach(() => {
      client = new GitHubApiClient('owner', 'repo');
      vi.clearAllMocks();
    });

    it('should find opt-outs in repository files', async () => {
      const mockFileContent = Buffer.from(`# Opted out contributors
user1
@user2
- user3
* user4`).toString('base64');

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            content: mockFileContent,
            encoding: 'base64'
          })
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          json: () => Promise.resolve({ message: 'Not found' })
        });

      // Continue mocking 404s for remaining files
      for (let i = 0; i < 8; i++) {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
          json: () => Promise.resolve({ message: 'Not found' })
        });
      }

      const result = await client.scanRepositoryOptOutFiles();
      
      expect(result).toContain('user1');
      expect(result).toContain('user2');
      expect(result).toContain('user3');
      expect(result).toContain('user4');
    });

    it('should find opt-outs in README sections', async () => {
      // Mock 404s for opt-out files
      for (let i = 0; i < 5; i++) {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
          json: () => Promise.resolve({ message: 'Not found' })
        });
      }

      const mockReadmeContent = Buffer.from(`# My Project

## Contributors

Thanks to all contributors!

## Contributor Opt-Out

The following contributors have opted out:
- user5
- @user6

## License

MIT`).toString('base64');

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          content: mockReadmeContent,
          encoding: 'base64'
        })
      });

      const result = await client.scanRepositoryOptOutFiles();
      
      expect(result).toContain('user5');
      expect(result).toContain('user6');
    });

    it('should handle files that do not exist', async () => {
      // Mock all files as 404
      for (let i = 0; i < 10; i++) {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
          json: () => Promise.resolve({ message: 'Not found' })
        });
      }

      const result = await client.scanRepositoryOptOutFiles();
      
      expect(result).toEqual([]);
    });
  });

  describe('getAllOptOutExclusions', () => {
    let client: GitHubApiClient;

    beforeEach(() => {
      client = new GitHubApiClient('owner', 'repo');
      vi.clearAllMocks();
    });

    it('should combine exclusions from all sources', async () => {
      // Mock file exclusions
      vi.mocked(fs.readFile).mockResolvedValue('user1\nuser2');

      // Mock issue search
      const mockIssues: GitHubIssue[] = [
        {
          id: 1,
          number: 123,
          title: 'Opt me out',
          body: null,
          state: 'open',
          labels: [{ id: 1, name: 'opt-out', color: 'ff0000' }],
          user: { login: 'user3', id: 3 },
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockIssues)
      });

      // Mock empty responses for other labels and keywords
      for (let i = 0; i < 5; i++) {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(i < 2 ? [] : { items: [] })
        });
      }

      // Mock repository file with user4
      const mockFileContent = Buffer.from('user4').toString('base64');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          content: mockFileContent,
          encoding: 'base64'
        })
      });

      // Mock 404s for remaining files
      for (let i = 0; i < 9; i++) {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
          json: () => Promise.resolve({ message: 'Not found' })
        });
      }

      const result = await getAllOptOutExclusions(client);
      
      expect(result).toContain('user1');
      expect(result).toContain('user2');
      expect(result).toContain('user3');
      expect(result).toContain('user4');
      expect(result).toHaveLength(4);
    });

    it('should deduplicate exclusions across sources', async () => {
      // Mock file exclusions
      vi.mocked(fs.readFile).mockResolvedValue('user1\nUSER1\nUser1');

      // Mock issue search returning user1
      const mockIssues: GitHubIssue[] = [
        {
          id: 1,
          number: 123,
          title: 'Opt out',
          body: null,
          state: 'open',
          labels: [{ id: 1, name: 'opt-out', color: 'ff0000' }],
          user: { login: 'USER1', id: 1 },
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockIssues)
      });

      // Mock empty responses
      for (let i = 0; i < 5; i++) {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(i < 2 ? [] : { items: [] })
        });
      }

      // Mock repository file with User1
      const mockFileContent = Buffer.from('User1').toString('base64');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          content: mockFileContent,
          encoding: 'base64'
        })
      });

      // Mock 404s for remaining files
      for (let i = 0; i < 9; i++) {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
          json: () => Promise.resolve({ message: 'Not found' })
        });
      }

      const result = await getAllOptOutExclusions(client);
      
      expect(result).toHaveLength(1);
      expect(result).toContain('user1');
    });

    it('should handle errors gracefully', async () => {
      // Mock file read error
      vi.mocked(fs.readFile).mockRejectedValue(new Error('Read error'));

      // Mock API errors
      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await getAllOptOutExclusions(client);
      
      expect(result).toEqual([]);
    });

    it('should allow disabling specific sources', async () => {
      // Mock file exclusions
      vi.mocked(fs.readFile).mockResolvedValue('user1');

      const result = await getAllOptOutExclusions(
        client,
        '.contributors-exclusions',
        false, // disable issue search
        false  // disable repo file search
      );
      
      expect(result).toEqual(['user1']);
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });
});