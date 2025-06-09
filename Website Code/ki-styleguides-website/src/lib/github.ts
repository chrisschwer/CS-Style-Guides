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