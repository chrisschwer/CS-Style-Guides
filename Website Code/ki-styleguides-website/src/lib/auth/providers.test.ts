import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getGoogleProvider, getGitHubProvider, getProviders } from './providers';

describe('Auth Providers', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('getGoogleProvider', () => {
    it('should throw error when Google credentials are not set', () => {
      delete process.env.AUTH_GOOGLE_ID;
      delete process.env.AUTH_GOOGLE_SECRET;

      expect(() => getGoogleProvider()).toThrowError(
        'Google OAuth credentials not configured'
      );
    });

    it('should return Google provider when credentials are set', () => {
      process.env.AUTH_GOOGLE_ID = 'test-client-id';
      process.env.AUTH_GOOGLE_SECRET = 'test-client-secret';

      const provider = getGoogleProvider();
      
      expect(provider).toBeDefined();
      expect(provider.id).toBe('google');
      expect(provider.type).toBe('oauth');
    });

    it('should configure minimal scopes', () => {
      process.env.AUTH_GOOGLE_ID = 'test-client-id';
      process.env.AUTH_GOOGLE_SECRET = 'test-client-secret';

      const provider = getGoogleProvider();
      const options = provider.options;
      
      expect(options.authorization.params.scope).toBe('openid email profile');
      expect(options.authorization.params.prompt).toBe('consent');
    });

    it('should map profile data correctly', () => {
      process.env.AUTH_GOOGLE_ID = 'test-client-id';
      process.env.AUTH_GOOGLE_SECRET = 'test-client-secret';

      const provider = getGoogleProvider();
      const mockProfile = {
        sub: '123456',
        name: 'Test User',
        email: 'test@example.com',
        picture: 'https://example.com/picture.jpg'
      };

      const mappedProfile = provider.options.profile(mockProfile);
      
      expect(mappedProfile).toEqual({
        id: '123456',
        name: 'Test User',
        email: 'test@example.com',
        image: 'https://example.com/picture.jpg',
        provider: 'google'
      });
    });
  });

  describe('getGitHubProvider', () => {
    it('should throw error when GitHub credentials are not set', () => {
      delete process.env.AUTH_GITHUB_ID;
      delete process.env.AUTH_GITHUB_SECRET;

      expect(() => getGitHubProvider()).toThrowError(
        'GitHub OAuth credentials not configured'
      );
    });

    it('should return GitHub provider when credentials are set', () => {
      process.env.AUTH_GITHUB_ID = 'test-client-id';
      process.env.AUTH_GITHUB_SECRET = 'test-client-secret';

      const provider = getGitHubProvider();
      
      expect(provider).toBeDefined();
      expect(provider.id).toBe('github');
      expect(provider.type).toBe('oauth');
    });

    it('should configure minimal scopes', () => {
      process.env.AUTH_GITHUB_ID = 'test-client-id';
      process.env.AUTH_GITHUB_SECRET = 'test-client-secret';

      const provider = getGitHubProvider();
      const options = provider.options;
      
      expect(options.authorization.params.scope).toBe('read:user user:email');
    });

    it('should map profile data correctly', () => {
      process.env.AUTH_GITHUB_ID = 'test-client-id';
      process.env.AUTH_GITHUB_SECRET = 'test-client-secret';

      const provider = getGitHubProvider();
      const mockProfile = {
        id: 123456,
        login: 'testuser',
        name: 'Test User',
        email: 'test@example.com',
        avatar_url: 'https://github.com/testuser.png'
      };

      const mappedProfile = provider.options.profile(mockProfile);
      
      expect(mappedProfile).toEqual({
        id: '123456',
        name: 'Test User',
        email: 'test@example.com',
        image: 'https://github.com/testuser.png',
        provider: 'github'
      });
    });

    it('should use login as name if name is not provided', () => {
      process.env.AUTH_GITHUB_ID = 'test-client-id';
      process.env.AUTH_GITHUB_SECRET = 'test-client-secret';

      const provider = getGitHubProvider();
      const mockProfile = {
        id: 123456,
        login: 'testuser',
        name: null,
        email: 'test@example.com',
        avatar_url: 'https://github.com/testuser.png'
      };

      const mappedProfile = provider.options.profile(mockProfile);
      
      expect(mappedProfile.name).toBe('testuser');
    });
  });

  describe('getProviders', () => {
    it('should return empty array when no providers are configured', () => {
      delete process.env.AUTH_GOOGLE_ID;
      delete process.env.AUTH_GOOGLE_SECRET;
      delete process.env.AUTH_GITHUB_ID;
      delete process.env.AUTH_GITHUB_SECRET;

      const providers = getProviders();
      
      expect(providers).toEqual([]);
    });

    it('should return Google provider when configured', () => {
      process.env.AUTH_GOOGLE_ID = 'test-client-id';
      process.env.AUTH_GOOGLE_SECRET = 'test-client-secret';
      delete process.env.AUTH_GITHUB_ID;
      delete process.env.AUTH_GITHUB_SECRET;

      const providers = getProviders();
      
      expect(providers).toHaveLength(1);
      expect(providers[0].id).toBe('google');
    });

    it('should return GitHub provider when configured', () => {
      delete process.env.AUTH_GOOGLE_ID;
      delete process.env.AUTH_GOOGLE_SECRET;
      process.env.AUTH_GITHUB_ID = 'test-client-id';
      process.env.AUTH_GITHUB_SECRET = 'test-client-secret';

      const providers = getProviders();
      
      expect(providers).toHaveLength(1);
      expect(providers[0].id).toBe('github');
    });

    it('should return both providers when both are configured', () => {
      process.env.AUTH_GOOGLE_ID = 'test-google-id';
      process.env.AUTH_GOOGLE_SECRET = 'test-google-secret';
      process.env.AUTH_GITHUB_ID = 'test-github-id';
      process.env.AUTH_GITHUB_SECRET = 'test-github-secret';

      const providers = getProviders();
      
      expect(providers).toHaveLength(2);
      expect(providers[0].id).toBe('google');
      expect(providers[1].id).toBe('github');
    });

    it('should handle errors gracefully', () => {
      // Set only one credential to trigger error
      process.env.AUTH_GOOGLE_ID = 'test-client-id';
      delete process.env.AUTH_GOOGLE_SECRET;
      process.env.AUTH_GITHUB_ID = 'test-client-id';
      delete process.env.AUTH_GITHUB_SECRET;

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const providers = getProviders();
      
      expect(providers).toEqual([]);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Google OAuth not configured:',
        expect.any(String)
      );
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'GitHub OAuth not configured:',
        expect.any(String)
      );

      consoleWarnSpy.mockRestore();
    });
  });
});