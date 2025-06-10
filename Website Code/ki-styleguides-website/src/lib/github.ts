import { getOrSet, cache } from './cache';
import fs from 'fs/promises';
import path from 'path';

export interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
}

export interface ContributorWithFirstCommit extends Contributor {
  first_commit_date?: string;
}

export interface GitHubApiError {
  message: string;
  status: number;
  documentation_url?: string;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  used: number;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  author: Contributor | null;
  committer: Contributor | null;
  html_url: string;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: string;
  labels: Array<{
    id: number;
    name: string;
    color: string;
  }>;
  user: {
    login: string;
    id: number;
  };
  created_at: string;
  updated_at: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    spdx_id: string;
    url: string;
  } | null;
  default_branch: string;
}

export interface ContributorDisplayData {
  login: string;
  name?: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
  first_commit_date?: string;
  isOwner: boolean;
}

export interface GitHubApiResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

export interface ApiRequestOptions {
  retries?: number;
  timeout?: number;
  headers?: Record<string, string>;
}

export class GitHubApiClient {
  private baseUrl = 'https://api.github.com';
  private owner = 'chrisschwer';
  private repo = 'CS-Style-Guides';
  private retryDelay = 1000;
  private maxRetries = 3;

  async fetchContributors(): Promise<ContributorWithFirstCommit[]> {
    const url = `${this.baseUrl}/repos/${this.owner}/${this.repo}/contributors`;
    
    try {
      const response = await this.makeRequest(url);
      const contributors: Contributor[] = await response.json();
      const contributorsWithDates = await this.enrichWithFirstCommitDates(contributors);
      return this.sortContributorsByFirstContribution(contributorsWithDates);
    } catch (error) {
      if (error instanceof GitHubApiError) {
        throw error;
      }
      
      throw new GitHubApiError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        0
      );
    }
  }

  private async makeRequest(url: string, retryCount = 0): Promise<Response> {
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'CS-Style-Guides-Website'
        }
      });

      if (!response.ok) {
        if (response.status === 403) {
          const rateLimitInfo = await this.getRateLimitInfo();
          if (rateLimitInfo && rateLimitInfo.remaining === 0) {
            const resetTime = new Date(rateLimitInfo.reset * 1000);
            throw new GitHubApiError(
              `Rate limit exceeded. Resets at ${resetTime.toISOString()}`,
              403
            );
          }
        }

        if (response.status >= 500 && retryCount < this.maxRetries) {
          await this.delay(this.retryDelay * Math.pow(2, retryCount));
          return this.makeRequest(url, retryCount + 1);
        }

        if (response.status === 404) {
          throw new GitHubApiError(
            'Repository not found or not accessible',
            404
          );
        }

        const errorData = await response.json().catch(() => ({}));
        throw new GitHubApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData.documentation_url
        );
      }

      return response;
    } catch (error) {
      if (error instanceof GitHubApiError) {
        throw error;
      }

      if (retryCount < this.maxRetries) {
        await this.delay(this.retryDelay * Math.pow(2, retryCount));
        return this.makeRequest(url, retryCount + 1);
      }

      throw new GitHubApiError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        0
      );
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async enrichWithFirstCommitDates(contributors: Contributor[]): Promise<ContributorWithFirstCommit[]> {
    const enrichedContributors: ContributorWithFirstCommit[] = [];
    
    for (const contributor of contributors) {
      try {
        const firstCommitDate = await this.getFirstCommitDate(contributor.login);
        enrichedContributors.push({
          ...contributor,
          first_commit_date: firstCommitDate
        });
      } catch (error) {
        enrichedContributors.push({
          ...contributor,
          first_commit_date: undefined
        });
      }
    }
    
    return enrichedContributors;
  }

  private async getFirstCommitDate(author: string): Promise<string | undefined> {
    const url = `${this.baseUrl}/repos/${this.owner}/${this.repo}/commits?author=${author}&per_page=1&page=1`;
    
    try {
      const response = await this.makeRequest(url);
      const commits = await response.json();
      
      if (commits.length > 0) {
        const lastCommitUrl = `${this.baseUrl}/repos/${this.owner}/${this.repo}/commits?author=${author}&per_page=1&until=${commits[0].commit.author.date}`;
        
        try {
          const lastResponse = await this.makeRequest(lastCommitUrl);
          const lastCommits = await lastResponse.json();
          if (lastCommits.length > 0) {
            return lastCommits[lastCommits.length - 1].commit.author.date;
          }
        } catch {
          // If we can't get the earliest commit, return the first one we found
        }
        
        return commits[0].commit.author.date;
      }

      return undefined;
    } catch {
      return undefined;
    }
  }

  private sortContributorsByFirstContribution(contributors: ContributorWithFirstCommit[]): ContributorWithFirstCommit[] {
    return contributors.sort((a, b) => {
      if (a.login === 'chrisschwer') return -1;
      if (b.login === 'chrisschwer') return 1;
      
      if (a.first_commit_date && b.first_commit_date) {
        return new Date(a.first_commit_date).getTime() - new Date(b.first_commit_date).getTime();
      }
      
      if (a.first_commit_date && !b.first_commit_date) return -1;
      if (!a.first_commit_date && b.first_commit_date) return 1;
      
      return a.id - b.id;
    });
  }

  async getContributors(): Promise<ContributorWithFirstCommit[]> {
    try {
      return await this.fetchContributors();
    } catch (error) {
      if (error instanceof GitHubApiError) {
        if (error.status === 403) {
          throw new GitHubApiError(
            'Access denied. The repository may be private or rate limit exceeded.',
            403,
            error.documentation_url
          );
        }
        
        if (error.status === 404) {
          throw new GitHubApiError(
            'Repository not found. Please check the repository name and access permissions.',
            404,
            error.documentation_url
          );
        }
        
        if (error.status >= 500) {
          throw new GitHubApiError(
            'GitHub API is currently unavailable. Please try again later.',
            error.status,
            error.documentation_url
          );
        }
      }
      
      throw error;
    }
  }

  async getRateLimitInfo(): Promise<RateLimitInfo | null> {
    try {
      const response = await fetch(`${this.baseUrl}/rate_limit`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'CS-Style-Guides-Website'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.rate;
      }
      
      return null;
    } catch {
      return null;
    }
  }

  async isRateLimited(): Promise<boolean> {
    const rateLimitInfo = await this.getRateLimitInfo();
    return rateLimitInfo ? rateLimitInfo.remaining === 0 : false;
  }

  async getContributorsWithFallback(): Promise<ContributorWithFirstCommit[]> {
    try {
      return await this.getContributors();
    } catch (error) {
      console.warn('Failed to fetch contributors from GitHub:', error);
      
      return [{
        id: 1,
        login: 'chrisschwer',
        avatar_url: 'https://github.com/chrisschwer.png',
        html_url: 'https://github.com/chrisschwer',
        contributions: 1,
        type: 'User',
        first_commit_date: undefined
      }];
    }
  }

  transformToDisplayData(contributors: ContributorWithFirstCommit[]): ContributorDisplayData[] {
    return contributors.map(contributor => ({
      login: contributor.login,
      name: contributor.login,
      avatar_url: contributor.avatar_url,
      html_url: contributor.html_url,
      contributions: contributor.contributions,
      first_commit_date: contributor.first_commit_date,
      isOwner: contributor.login === this.owner
    }));
  }

  async getContributorsForDisplay(): Promise<ContributorDisplayData[]> {
    const contributors = await this.getContributorsWithFallback();
    return this.transformToDisplayData(contributors);
  }

  /**
   * Searches GitHub issues for opt-out requests
   * Looks for issues with specific labels or keywords in the title/body
   * @param labels - Array of label names to search for (e.g., ['opt-out', 'exclude-contributor'])
   * @param keywords - Array of keywords to search in issue titles/bodies
   * @returns Array of usernames who have requested opt-out via issues
   */
  async searchOptOutIssues(
    labels: string[] = ['opt-out', 'contributor-opt-out', 'exclude-me'],
    keywords: string[] = ['opt out', 'exclude me', 'remove me from contributors']
  ): Promise<string[]> {
    const optedOutUsers = new Set<string>();
    
    try {
      // Search by labels
      for (const label of labels) {
        const labelUrl = `${this.baseUrl}/repos/${this.owner}/${this.repo}/issues?state=all&labels=${encodeURIComponent(label)}&per_page=100`;
        
        try {
          const response = await this.makeRequest(labelUrl);
          const issues: GitHubIssue[] = await response.json();
          
          // Add issue authors to opt-out list
          issues.forEach(issue => {
            if (issue.user && issue.user.login) {
              optedOutUsers.add(issue.user.login.toLowerCase());
              console.log(`[Opt-out] Found opt-out request from ${issue.user.login} via issue #${issue.number}`);
            }
          });
        } catch (error) {
          console.warn(`Failed to search issues with label "${label}":`, error);
        }
      }
      
      // Search by keywords in issue title and body
      for (const keyword of keywords) {
        const searchUrl = `${this.baseUrl}/search/issues?q=${encodeURIComponent(keyword)}+repo:${this.owner}/${this.repo}+type:issue&per_page=100`;
        
        try {
          const response = await this.makeRequest(searchUrl);
          const searchResult = await response.json();
          
          if (searchResult.items) {
            searchResult.items.forEach((issue: GitHubIssue) => {
              // Check if the issue is specifically about opting out
              const titleLower = issue.title.toLowerCase();
              const bodyLower = (issue.body || '').toLowerCase();
              
              // Only add if the issue clearly indicates an opt-out request
              if (
                titleLower.includes('opt out') || 
                titleLower.includes('exclude me') ||
                titleLower.includes('remove me') ||
                (bodyLower.includes('opt out') && bodyLower.includes('contributor')) ||
                (bodyLower.includes('exclude') && bodyLower.includes('contributor')) ||
                (bodyLower.includes('remove') && bodyLower.includes('contributor'))
              ) {
                if (issue.user && issue.user.login) {
                  optedOutUsers.add(issue.user.login.toLowerCase());
                  console.log(`[Opt-out] Found opt-out request from ${issue.user.login} via issue #${issue.number} (keyword: "${keyword}")`);
                }
              }
            });
          }
        } catch (error) {
          console.warn(`Failed to search issues with keyword "${keyword}":`, error);
        }
      }
      
    } catch (error) {
      console.error('[Opt-out] Error searching for opt-out issues:', error);
    }
    
    return Array.from(optedOutUsers);
  }

  /**
   * Scans repository files for opt-out declarations
   * Looks for specific files that might contain opt-out requests
   * @param filePaths - Array of file paths to check (e.g., ['.github/CONTRIBUTORS_OPT_OUT', 'docs/opt-out.md'])
   * @returns Array of usernames who have opted out via repository files
   */
  async scanRepositoryOptOutFiles(
    filePaths: string[] = [
      '.github/CONTRIBUTORS_OPT_OUT',
      '.github/contributors-opt-out.txt',
      'docs/contributors-opt-out.md',
      'CONTRIBUTORS_OPT_OUT',
      '.contributors-opt-out'
    ]
  ): Promise<string[]> {
    const optedOutUsers = new Set<string>();
    
    for (const filePath of filePaths) {
      try {
        const url = `${this.baseUrl}/repos/${this.owner}/${this.repo}/contents/${filePath}`;
        const response = await this.makeRequest(url);
        
        if (response.ok) {
          const fileData = await response.json();
          
          // GitHub API returns file content as base64
          if (fileData.content && fileData.encoding === 'base64') {
            const content = atob(fileData.content.replace(/\n/g, ''));
            
            // Parse the content similar to the exclusions file
            const lines = content.split('\n');
            lines.forEach(line => {
              const trimmedLine = line.trim();
              // Skip comments and empty lines
              if (trimmedLine && !trimmedLine.startsWith('#')) {
                // Extract username (handle various formats)
                // Format could be: "username" or "@username" or "- username" or "* username"
                const username = trimmedLine
                  .replace(/^[\-\*\s@]+/, '') // Remove leading -, *, spaces, @
                  .trim();
                
                if (username) {
                  optedOutUsers.add(username.toLowerCase());
                  console.log(`[Opt-out] Found opt-out for ${username} in ${filePath}`);
                }
              }
            });
          }
        }
      } catch (error) {
        // File not found is expected for most repos, only log other errors
        if (error instanceof GitHubApiError && error.status === 404) {
          // Silently ignore - file doesn't exist
        } else {
          console.warn(`[Opt-out] Error checking file ${filePath}:`, error);
        }
      }
    }
    
    // Also check README files for opt-out sections
    try {
      const readmeFiles = ['README.md', 'readme.md', 'README', 'readme'];
      
      for (const readmeFile of readmeFiles) {
        const url = `${this.baseUrl}/repos/${this.owner}/${this.repo}/contents/${readmeFile}`;
        
        try {
          const response = await this.makeRequest(url);
          
          if (response.ok) {
            const fileData = await response.json();
            
            if (fileData.content && fileData.encoding === 'base64') {
              const content = atob(fileData.content.replace(/\n/g, ''));
              
              // Look for opt-out sections in README
              const lines = content.split('\n');
              let inOptOutSection = false;
              
              for (const line of lines) {
                const lowerLine = line.toLowerCase();
                
                // Check if we're entering an opt-out section
                if (
                  lowerLine.includes('contributor opt-out') ||
                  lowerLine.includes('contributors opt-out') ||
                  lowerLine.includes('opted out contributors') ||
                  lowerLine.includes('excluded contributors')
                ) {
                  inOptOutSection = true;
                  continue;
                }
                
                // Check if we're leaving the section (new header)
                if (inOptOutSection && line.match(/^#+\s/)) {
                  inOptOutSection = false;
                  continue;
                }
                
                // Parse usernames in opt-out section
                if (inOptOutSection) {
                  const trimmedLine = line.trim();
                  if (trimmedLine && !trimmedLine.startsWith('#')) {
                    // Extract username from list formats
                    const match = trimmedLine.match(/^[\-\*\s]*@?(\w+)/);
                    if (match && match[1]) {
                      optedOutUsers.add(match[1].toLowerCase());
                      console.log(`[Opt-out] Found opt-out for ${match[1]} in ${readmeFile}`);
                    }
                  }
                }
              }
            }
            
            // Found and processed a README, don't check others
            break;
          }
        } catch (error) {
          // Silently ignore 404s for README files
          if (!(error instanceof GitHubApiError && error.status === 404)) {
            console.warn(`[Opt-out] Error checking ${readmeFile}:`, error);
          }
        }
      }
    } catch (error) {
      console.warn('[Opt-out] Error scanning README files:', error);
    }
    
    return Array.from(optedOutUsers);
  }
}

class GitHubApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public documentation_url?: string
  ) {
    super(message);
    this.name = 'GitHubApiError';
  }
}

/**
 * Reads and parses the contributors exclusion file
 * @param filePath - Path to the .contributors-exclusions file
 * @returns Array of excluded usernames (lowercase for case-insensitive comparison)
 */
export async function readExclusionsFile(filePath: string = '.contributors-exclusions'): Promise<string[]> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Parse the file content
    const exclusions = content
      .split('\n')
      .map(line => line.trim())
      // Remove comments and empty lines
      .filter(line => line.length > 0 && !line.startsWith('#'))
      // Convert to lowercase for case-insensitive comparison
      .map(username => username.toLowerCase());
    
    // Remove duplicates
    return [...new Set(exclusions)];
  } catch (error) {
    // If file doesn't exist or can't be read, return empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.log('[Exclusions] No exclusions file found, all contributors will be shown');
      return [];
    }
    
    console.error('[Exclusions] Error reading exclusions file:', error);
    return [];
  }
}

/**
 * Filters out excluded contributors from the list
 * @param contributors - Array of contributors
 * @param exclusions - Array of excluded usernames (lowercase)
 * @returns Filtered array of contributors
 */
export function filterExcludedContributors<T extends { login: string }>(
  contributors: T[],
  exclusions: string[]
): T[] {
  if (exclusions.length === 0) {
    return contributors;
  }
  
  return contributors.filter(contributor => 
    !exclusions.includes(contributor.login.toLowerCase())
  );
}

/**
 * Gets all opt-out exclusions from multiple sources
 * @param client - GitHub API client instance
 * @param exclusionsFilePath - Path to the exclusions file
 * @param searchIssues - Whether to search GitHub issues for opt-outs
 * @param scanRepoFiles - Whether to scan repository files for opt-outs
 * @returns Combined array of excluded usernames (lowercase)
 */
export async function getAllOptOutExclusions(
  client: GitHubApiClient,
  exclusionsFilePath: string = '.contributors-exclusions',
  searchIssues: boolean = true,
  scanRepoFiles: boolean = true
): Promise<string[]> {
  const exclusions = new Set<string>();
  
  // 1. Read from exclusions file
  const fileExclusions = await readExclusionsFile(exclusionsFilePath);
  fileExclusions.forEach(username => exclusions.add(username));
  console.log(`[Opt-out] Found ${fileExclusions.length} exclusions from file`);
  
  // 2. Search GitHub issues if enabled
  if (searchIssues) {
    try {
      const issueExclusions = await client.searchOptOutIssues();
      issueExclusions.forEach(username => exclusions.add(username));
      console.log(`[Opt-out] Found ${issueExclusions.length} exclusions from GitHub issues`);
    } catch (error) {
      console.warn('[Opt-out] Failed to search GitHub issues for opt-outs:', error);
    }
  }
  
  // 3. Scan repository files if enabled
  if (scanRepoFiles) {
    try {
      const repoFileExclusions = await client.scanRepositoryOptOutFiles();
      repoFileExclusions.forEach(username => exclusions.add(username));
      console.log(`[Opt-out] Found ${repoFileExclusions.length} exclusions from repository files`);
    } catch (error) {
      console.warn('[Opt-out] Failed to scan repository files for opt-outs:', error);
    }
  }
  
  const totalExclusions = Array.from(exclusions);
  console.log(`[Opt-out] Total exclusions: ${totalExclusions.length}`);
  
  return totalExclusions;
}

/**
 * Cached version of GitHub API client
 * This uses a 24-hour cache to reduce API calls during builds
 */
export const createCachedGitHubClient = (owner: string, repo: string, token?: string) => {
  const client = new GitHubApiClient(owner, repo, token);
  
  return {
    /**
     * Get contributors with 24-hour caching
     * This reduces API calls during builds and improves build times
     */
    async getCachedContributors(): Promise<ContributorWithFirstCommit[]> {
      const cacheKey = `github-contributors-${owner}-${repo}`;
      
      return getOrSet(
        cacheKey,
        async () => {
          console.log(`[Cache] Fetching fresh contributors data for ${owner}/${repo}`);
          return await client.getContributors();
        },
        { expiresIn: 24 * 60 * 60 * 1000 } // 24 hours
      );
    },
    
    /**
     * Get contributors with exclusions applied from all sources
     * @param exclusionsPath - Path to the exclusions file (optional)
     * @param searchIssues - Whether to search GitHub issues for opt-outs
     * @param scanRepoFiles - Whether to scan repository files for opt-outs
     */
    async getCachedContributorsWithExclusions(
      exclusionsPath?: string,
      searchIssues: boolean = true,
      scanRepoFiles: boolean = true
    ): Promise<ContributorWithFirstCommit[]> {
      const contributors = await this.getCachedContributors();
      const exclusions = await getAllOptOutExclusions(
        client,
        exclusionsPath,
        searchIssues,
        scanRepoFiles
      );
      
      if (exclusions.length > 0) {
        console.log(`[Exclusions] Filtering out ${exclusions.length} excluded contributors`);
      }
      
      return filterExcludedContributors(contributors, exclusions);
    },
    
    /**
     * Get contributors for display with caching and fallback
     */
    async getCachedContributorsForDisplay(): Promise<ContributorDisplayData[]> {
      const cacheKey = `github-contributors-display-${owner}-${repo}`;
      
      return getOrSet(
        cacheKey,
        async () => {
          console.log(`[Cache] Fetching fresh display data for ${owner}/${repo}`);
          return await client.getContributorsForDisplay();
        },
        { expiresIn: 24 * 60 * 60 * 1000 } // 24 hours
      );
    },
    
    /**
     * Get contributors for display with exclusions applied from all sources
     * @param exclusionsPath - Path to the exclusions file (optional)
     * @param searchIssues - Whether to search GitHub issues for opt-outs
     * @param scanRepoFiles - Whether to scan repository files for opt-outs
     */
    async getCachedContributorsForDisplayWithExclusions(
      exclusionsPath?: string,
      searchIssues: boolean = true,
      scanRepoFiles: boolean = true
    ): Promise<ContributorDisplayData[]> {
      const contributors = await this.getCachedContributorsForDisplay();
      const exclusions = await getAllOptOutExclusions(
        client,
        exclusionsPath,
        searchIssues,
        scanRepoFiles
      );
      
      if (exclusions.length > 0) {
        console.log(`[Exclusions] Filtering out ${exclusions.length} excluded contributors from display`);
      }
      
      return filterExcludedContributors(contributors, exclusions);
    },
    
    /**
     * Force refresh the cache (useful for manual updates)
     */
    async refreshCache(): Promise<void> {
      const cacheKeys = [
        `github-contributors-${owner}-${repo}`,
        `github-contributors-display-${owner}-${repo}`
      ];
      
      // Clear existing cache entries
      for (const key of cacheKeys) {
        await cache.delete(key);
      }
      
      // Pre-populate with fresh data
      await this.getCachedContributors();
      await this.getCachedContributorsForDisplay();
    },
    
    // Expose non-cached methods for when fresh data is needed
    client
  };
};