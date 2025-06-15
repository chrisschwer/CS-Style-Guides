import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getGoogleProvider, getProviders } from './providers';

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

  describe('getProviders', () => {
    it('should return empty array when no providers are configured', () => {
      delete process.env.AUTH_GOOGLE_ID;
      delete process.env.AUTH_GOOGLE_SECRET;

      const providers = getProviders();
      
      expect(providers).toEqual([]);
    });

    it('should return Google provider when configured', () => {
      process.env.AUTH_GOOGLE_ID = 'test-client-id';
      process.env.AUTH_GOOGLE_SECRET = 'test-client-secret';

      const providers = getProviders();
      
      expect(providers).toHaveLength(1);
      expect(providers[0].id).toBe('google');
    });

    it('should handle errors gracefully', () => {
      // Set only one credential to trigger error
      process.env.AUTH_GOOGLE_ID = 'test-client-id';
      delete process.env.AUTH_GOOGLE_SECRET;

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const providers = getProviders();
      
      expect(providers).toEqual([]);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Google OAuth not configured:',
        expect.any(String)
      );

      consoleWarnSpy.mockRestore();
    });
  });
});