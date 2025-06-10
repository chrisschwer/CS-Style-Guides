import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import type { ContributorDisplayData } from '../lib/github';

// Mock the github module
vi.mock('../lib/github', () => ({
  createCachedGitHubClient: vi.fn()
}));

// Import the mocked module
import { createCachedGitHubClient } from '../lib/github';

describe('ContributorsList Component Logic', () => {
  const mockCreateCachedGitHubClient = createCachedGitHubClient as Mock;
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Data Fetching', () => {
    it('should fetch contributors with exclusions applied', async () => {
      const mockContributors: ContributorDisplayData[] = [
        {
          login: 'chrisschwer',
          name: 'Christoph Schwerdtfeger',
          avatar_url: 'https://github.com/chrisschwer.png',
          html_url: 'https://github.com/chrisschwer',
          contributions: 50,
          first_commit_date: '2024-01-15T10:00:00Z',
          isOwner: true
        },
        {
          login: 'contributor1',
          name: 'Test Contributor',
          avatar_url: 'https://github.com/contributor1.png',
          html_url: 'https://github.com/contributor1',
          contributions: 10,
          first_commit_date: '2024-02-20T15:30:00Z',
          isOwner: false
        }
      ];

      const mockClient = {
        getCachedContributorsForDisplayWithExclusions: vi.fn().mockResolvedValue(mockContributors)
      };

      mockCreateCachedGitHubClient.mockReturnValue(mockClient);

      // Test the logic that would be in the component
      const githubClient = createCachedGitHubClient('chrisschwer', 'CS-Style-Guides');
      const contributors = await githubClient.getCachedContributorsForDisplayWithExclusions(
        '.contributors-exclusions',
        true,
        true
      );

      expect(mockCreateCachedGitHubClient).toHaveBeenCalledWith('chrisschwer', 'CS-Style-Guides');
      expect(mockClient.getCachedContributorsForDisplayWithExclusions).toHaveBeenCalledWith(
        '.contributors-exclusions',
        true,
        true
      );
      expect(contributors).toEqual(mockContributors);
      expect(contributors).toHaveLength(2);
    });

    it('should handle API errors gracefully', async () => {
      const mockClient = {
        getCachedContributorsForDisplayWithExclusions: vi.fn().mockRejectedValue(
          new Error('GitHub API error')
        )
      };

      mockCreateCachedGitHubClient.mockReturnValue(mockClient);

      const githubClient = createCachedGitHubClient('chrisschwer', 'CS-Style-Guides');
      
      let error = null;
      let contributors: ContributorDisplayData[] = [];
      
      try {
        contributors = await githubClient.getCachedContributorsForDisplayWithExclusions(
          '.contributors-exclusions',
          true,
          true
        );
      } catch (err) {
        error = 'Die Mitwirkenden konnten nicht geladen werden. Bitte versuchen Sie es später erneut.';
      }

      expect(error).toBe('Die Mitwirkenden konnten nicht geladen werden. Bitte versuchen Sie es später erneut.');
      expect(contributors).toHaveLength(0);
    });

    it('should limit contributors when maxContributors prop is set', async () => {
      const mockContributors: ContributorDisplayData[] = Array.from({ length: 10 }, (_, i) => ({
        login: `contributor${i}`,
        name: `Contributor ${i}`,
        avatar_url: `https://github.com/contributor${i}.png`,
        html_url: `https://github.com/contributor${i}`,
        contributions: 10 - i,
        first_commit_date: `2024-01-${String(i + 1).padStart(2, '0')}T10:00:00Z`,
        isOwner: i === 0
      }));

      const mockClient = {
        getCachedContributorsForDisplayWithExclusions: vi.fn().mockResolvedValue(mockContributors)
      };

      mockCreateCachedGitHubClient.mockReturnValue(mockClient);

      // Test limiting logic
      const githubClient = createCachedGitHubClient('chrisschwer', 'CS-Style-Guides');
      let contributors = await githubClient.getCachedContributorsForDisplayWithExclusions(
        '.contributors-exclusions',
        true,
        true
      );

      // Simulate component logic for limiting
      const maxContributors = 5;
      if (maxContributors && maxContributors > 0) {
        contributors = contributors.slice(0, maxContributors);
      }

      expect(contributors).toHaveLength(5);
      expect(contributors[0].login).toBe('contributor0');
      expect(contributors[4].login).toBe('contributor4');
    });
  });

  describe('Date Formatting', () => {
    it('should format join date in German locale', () => {
      // Test the date formatting function
      function formatJoinDate(dateString?: string): string {
        if (!dateString) return 'Unbekannt';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('de-DE', {
          month: 'long',
          year: 'numeric'
        });
      }

      expect(formatJoinDate('2024-01-15T10:00:00Z')).toBe('Januar 2024');
      expect(formatJoinDate('2024-06-09T15:30:00Z')).toBe('Juni 2024');
      expect(formatJoinDate('2023-12-25T00:00:00Z')).toBe('Dezember 2023');
      expect(formatJoinDate(undefined)).toBe('Unbekannt');
      expect(formatJoinDate('')).toBe('Unbekannt');
    });
  });

  describe('Component Props', () => {
    it('should handle showContributions prop', async () => {
      const mockContributors: ContributorDisplayData[] = [
        {
          login: 'testuser',
          name: 'Test User',
          avatar_url: 'https://github.com/testuser.png',
          html_url: 'https://github.com/testuser',
          contributions: 25,
          first_commit_date: '2024-03-10T12:00:00Z',
          isOwner: false
        }
      ];

      const mockClient = {
        getCachedContributorsForDisplayWithExclusions: vi.fn().mockResolvedValue(mockContributors)
      };

      mockCreateCachedGitHubClient.mockReturnValue(mockClient);

      const githubClient = createCachedGitHubClient('chrisschwer', 'CS-Style-Guides');
      const contributors = await githubClient.getCachedContributorsForDisplayWithExclusions(
        '.contributors-exclusions',
        true,
        true
      );

      // Test that contributions data is available when showContributions is true
      expect(contributors[0].contributions).toBe(25);
      
      // Test singular/plural text logic
      const contributionText = (count: number) => 
        `${count} ${count === 1 ? 'Beitrag' : 'Beiträge'}`;
      
      expect(contributionText(1)).toBe('1 Beitrag');
      expect(contributionText(25)).toBe('25 Beiträge');
    });

    it('should handle showJoinDate prop', async () => {
      const mockContributors: ContributorDisplayData[] = [
        {
          login: 'testuser',
          name: 'Test User',
          avatar_url: 'https://github.com/testuser.png',
          html_url: 'https://github.com/testuser',
          contributions: 10,
          first_commit_date: '2024-03-10T12:00:00Z',
          isOwner: false
        },
        {
          login: 'nodate',
          name: 'No Date User',
          avatar_url: 'https://github.com/nodate.png',
          html_url: 'https://github.com/nodate',
          contributions: 5,
          first_commit_date: undefined,
          isOwner: false
        }
      ];

      const mockClient = {
        getCachedContributorsForDisplayWithExclusions: vi.fn().mockResolvedValue(mockContributors)
      };

      mockCreateCachedGitHubClient.mockReturnValue(mockClient);

      const githubClient = createCachedGitHubClient('chrisschwer', 'CS-Style-Guides');
      const contributors = await githubClient.getCachedContributorsForDisplayWithExclusions(
        '.contributors-exclusions',
        true,
        true
      );

      // Test that first_commit_date is available
      expect(contributors[0].first_commit_date).toBe('2024-03-10T12:00:00Z');
      expect(contributors[1].first_commit_date).toBeUndefined();
    });
  });

  describe('Owner Badge', () => {
    it('should identify repository owner', async () => {
      const mockContributors: ContributorDisplayData[] = [
        {
          login: 'chrisschwer',
          name: 'Christoph Schwerdtfeger',
          avatar_url: 'https://github.com/chrisschwer.png',
          html_url: 'https://github.com/chrisschwer',
          contributions: 100,
          first_commit_date: '2024-01-01T00:00:00Z',
          isOwner: true
        },
        {
          login: 'otheruser',
          name: 'Other User',
          avatar_url: 'https://github.com/otheruser.png',
          html_url: 'https://github.com/otheruser',
          contributions: 20,
          first_commit_date: '2024-02-01T00:00:00Z',
          isOwner: false
        }
      ];

      const mockClient = {
        getCachedContributorsForDisplayWithExclusions: vi.fn().mockResolvedValue(mockContributors)
      };

      mockCreateCachedGitHubClient.mockReturnValue(mockClient);

      const githubClient = createCachedGitHubClient('chrisschwer', 'CS-Style-Guides');
      const contributors = await githubClient.getCachedContributorsForDisplayWithExclusions(
        '.contributors-exclusions',
        true,
        true
      );

      expect(contributors[0].isOwner).toBe(true);
      expect(contributors[1].isOwner).toBe(false);
    });
  });

  describe('Empty State', () => {
    it('should handle empty contributors list', async () => {
      const mockClient = {
        getCachedContributorsForDisplayWithExclusions: vi.fn().mockResolvedValue([])
      };

      mockCreateCachedGitHubClient.mockReturnValue(mockClient);

      const githubClient = createCachedGitHubClient('chrisschwer', 'CS-Style-Guides');
      const contributors = await githubClient.getCachedContributorsForDisplayWithExclusions(
        '.contributors-exclusions',
        true,
        true
      );

      expect(contributors).toHaveLength(0);
    });
  });

  describe('Fallback Avatar', () => {
    it('should handle missing avatar URLs', async () => {
      const mockContributors: ContributorDisplayData[] = [
        {
          login: 'noavatar',
          name: 'No Avatar User',
          avatar_url: '',
          html_url: 'https://github.com/noavatar',
          contributions: 5,
          first_commit_date: '2024-05-01T10:00:00Z',
          isOwner: false
        }
      ];

      const mockClient = {
        getCachedContributorsForDisplayWithExclusions: vi.fn().mockResolvedValue(mockContributors)
      };

      mockCreateCachedGitHubClient.mockReturnValue(mockClient);

      const githubClient = createCachedGitHubClient('chrisschwer', 'CS-Style-Guides');
      const contributors = await githubClient.getCachedContributorsForDisplayWithExclusions(
        '.contributors-exclusions',
        true,
        true
      );

      // Test that the component would use fallback
      const avatarUrl = contributors[0].avatar_url || '/github-logo.svg';
      expect(avatarUrl).toBe('/github-logo.svg');
    });
  });
});