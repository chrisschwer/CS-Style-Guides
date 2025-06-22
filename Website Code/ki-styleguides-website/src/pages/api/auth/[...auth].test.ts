import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET, POST } from './[...auth]';
import type { AstroCookies, AstroGlobal } from 'astro';

// Mock the session module
vi.mock('../../../lib/auth/session', () => ({
  createSession: vi.fn().mockResolvedValue('mock-session-id'),
  deleteSession: vi.fn().mockResolvedValue(undefined),
  setSessionCookie: vi.fn(),
  clearSessionCookie: vi.fn(),
  getCurrentUser: vi.fn(),
  generateCSRFToken: vi.fn().mockReturnValue('mock-csrf-token'),
  storeCSRFToken: vi.fn().mockResolvedValue(undefined),
}));

// Import mocked functions
import {
  createSession,
  deleteSession,
  setSessionCookie,
  clearSessionCookie,
  getCurrentUser,
  generateCSRFToken,
  storeCSRFToken,
} from '../../../lib/auth/session';

// Helper to create mock context
const createMockContext = (path: string, searchParams: Record<string, string> = {}) => {
  const url = new URL(`http://localhost:4321${path}`);
  Object.entries(searchParams).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const cookies = new Map<string, { value: string; options?: any }>();
  
  const mockCookies: AstroCookies = {
    get: vi.fn((name: string) => {
      const cookie = cookies.get(name);
      return cookie ? { value: cookie.value } : undefined;
    }),
    set: vi.fn((name: string, value: string, options?: any) => {
      cookies.set(name, { value, options });
    }),
    delete: vi.fn((name: string) => {
      cookies.delete(name);
    }),
    has: vi.fn((name: string) => cookies.has(name)),
  } as any;

  const redirect = vi.fn((location: string) => {
    return new Response(null, {
      status: 302,
      headers: { Location: location },
    });
  });

  const segments = path.split('/').filter(s => s && s !== 'api' && s !== 'auth');
  
  return {
    params: { auth: segments.join('/') },
    url,
    cookies: mockCookies,
    redirect,
    request: new Request(url),
  } as unknown as AstroGlobal;
};

describe('Auth API Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/auth/login', () => {
    it('should redirect to OAuth provider with valid provider', async () => {
      const context = createMockContext('/api/auth/login', { provider: 'google' });
      const response = await GET(context);
      
      expect(context.cookies.set).toHaveBeenCalledWith(
        'oauth-state',
        'mock-csrf-token',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
          maxAge: 600,
        })
      );
      
      expect(context.redirect).toHaveBeenCalled();
      const redirectUrl = (context.redirect as any).mock.calls[0][0];
      expect(redirectUrl).toContain('/api/auth/callback');
      expect(redirectUrl).toContain('provider=google');
    });

    it('should return 400 for invalid provider', async () => {
      const context = createMockContext('/api/auth/login', { provider: 'invalid' });
      const response = await GET(context);
      
      expect(response.status).toBe(400);
      const text = await response.text();
      expect(text).toBe('Invalid provider');
    });

    it('should return 400 for missing provider', async () => {
      const context = createMockContext('/api/auth/login');
      const response = await GET(context);
      
      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/auth/callback', () => {
    it('should create session for valid OAuth callback', async () => {
      const context = createMockContext('/api/auth/callback', {
        provider: 'google',
        code: 'auth-code',
        state: 'csrf-token',
      });
      
      // Set the state cookie
      context.cookies.set('oauth-state', 'csrf-token');
      
      const response = await GET(context);
      
      expect(createSession).toHaveBeenCalled();
      expect(setSessionCookie).toHaveBeenCalledWith(context.cookies, 'mock-session-id');
      expect(storeCSRFToken).toHaveBeenCalledWith('mock-session-id', 'mock-csrf-token');
      expect(context.redirect).toHaveBeenCalledWith('/dashboard');
    });

    it('should redirect with error for OAuth error', async () => {
      const context = createMockContext('/api/auth/callback', {
        error: 'access_denied',
      });
      
      const response = await GET(context);
      
      expect(context.redirect).toHaveBeenCalledWith('/sign-in?error=oauth_error');
    });

    it('should redirect with error for invalid CSRF state', async () => {
      const context = createMockContext('/api/auth/callback', {
        provider: 'google',
        code: 'auth-code',
        state: 'wrong-token',
      });
      
      context.cookies.set('oauth-state', 'correct-token');
      
      const response = await GET(context);
      
      expect(context.redirect).toHaveBeenCalledWith('/sign-in?error=invalid_state');
    });

    it('should redirect with error for missing params', async () => {
      const context = createMockContext('/api/auth/callback', {
        provider: 'google',
      });
      
      context.cookies.set('oauth-state', 'csrf-token');
      
      const response = await GET(context);
      
      expect(context.redirect).toHaveBeenCalledWith('/sign-in?error=missing_params');
    });

    it('should use return URL if set', async () => {
      const context = createMockContext('/api/auth/callback', {
        provider: 'google',
        code: 'auth-code',
        state: 'csrf-token',
      });
      
      context.cookies.set('oauth-state', 'csrf-token');
      context.cookies.set('return-url', '/editor/new');
      
      const response = await GET(context);
      
      expect(context.redirect).toHaveBeenCalledWith('/editor/new');
      expect(context.cookies.delete).toHaveBeenCalledWith('return-url', { path: '/' });
    });
  });

  describe('GET /api/auth/logout', () => {
    it('should clear session and redirect when authenticated', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'contributor',
      };
      
      (getCurrentUser as any).mockResolvedValueOnce(mockUser);
      
      const context = createMockContext('/api/auth/logout');
      context.cookies.set('ki-styleguides-session', 'session-id');
      
      const response = await GET(context);
      
      expect(deleteSession).toHaveBeenCalledWith('session-id');
      expect(clearSessionCookie).toHaveBeenCalledWith(context.cookies);
      expect(context.redirect).toHaveBeenCalledWith('/');
    });

    it('should redirect even when not authenticated', async () => {
      (getCurrentUser as any).mockResolvedValueOnce(null);
      
      const context = createMockContext('/api/auth/logout');
      const response = await GET(context);
      
      expect(clearSessionCookie).toHaveBeenCalledWith(context.cookies);
      expect(context.redirect).toHaveBeenCalledWith('/');
    });
  });

  describe('GET /api/auth/session', () => {
    it('should return user data when authenticated', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'contributor',
        provider: 'google',
      };
      
      (getCurrentUser as any).mockResolvedValueOnce(mockUser);
      
      const context = createMockContext('/api/auth/session');
      const response = await GET(context);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({
        authenticated: true,
        user: mockUser,
      });
    });

    it('should return unauthenticated when no user', async () => {
      (getCurrentUser as any).mockResolvedValueOnce(null);
      
      const context = createMockContext('/api/auth/session');
      const response = await GET(context);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({ authenticated: false });
    });
  });

  describe('GET /api/auth/unknown', () => {
    it('should return 404 for unknown action', async () => {
      const context = createMockContext('/api/auth/unknown');
      const response = await GET(context);
      
      expect(response.status).toBe(404);
      const text = await response.text();
      expect(text).toBe('Not found');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout via POST request', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
      };
      
      (getCurrentUser as any).mockResolvedValueOnce(mockUser);
      
      const context = createMockContext('/api/auth/logout');
      context.cookies.set('ki-styleguides-session', 'session-id');
      
      const response = await POST(context);
      
      expect(deleteSession).toHaveBeenCalledWith('session-id');
      expect(clearSessionCookie).toHaveBeenCalledWith(context.cookies);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({ success: true });
    });

    it('should handle POST logout when not authenticated', async () => {
      (getCurrentUser as any).mockResolvedValueOnce(null);
      
      const context = createMockContext('/api/auth/logout');
      const response = await POST(context);
      
      expect(clearSessionCookie).toHaveBeenCalledWith(context.cookies);
      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/auth/unknown', () => {
    it('should return 404 for unknown POST action', async () => {
      const context = createMockContext('/api/auth/unknown');
      const response = await POST(context);
      
      expect(response.status).toBe(404);
    });
  });
});