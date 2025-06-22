import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { AstroCookies } from 'astro';
import {
  SESSION_CONFIG,
  createSession,
  getSession,
  deleteSession,
  setSessionCookie,
  clearSessionCookie,
  getCurrentUser,
  isAuthenticated,
  hasRole,
  refreshSession,
  generateCSRFToken,
  storeCSRFToken,
  validateCSRFToken,
  cleanupExpiredSessions,
  __testHelpers,
  type User,
} from './session';

// Mock user for testing
const mockUser: User = {
  id: '123',
  email: 'test@example.com',
  name: 'Test User',
  provider: 'google',
  role: 'contributor',
  blocked: false,
  emailVerified: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Mock cookies implementation
const createMockCookies = () => {
  const store = new Map<string, any>();
  
  return {
    get: vi.fn((name: string) => store.get(name)),
    set: vi.fn((name: string, value: string, options?: any) => {
      store.set(name, { value, options });
    }),
    delete: vi.fn((name: string) => {
      store.delete(name);
    }),
    has: vi.fn((name: string) => store.has(name)),
  } as unknown as AstroCookies;
};

describe('Session Management', () => {
  beforeEach(() => {
    // Clear any existing sessions before each test
    vi.clearAllMocks();
    __testHelpers.clearStore();
  });

  describe('SESSION_CONFIG', () => {
    it('should have correct configuration values', () => {
      expect(SESSION_CONFIG.cookieName).toBe('ki-styleguides-session');
      expect(SESSION_CONFIG.maxAge).toBe(30 * 24 * 60 * 60); // 30 days
      expect(SESSION_CONFIG.httpOnly).toBe(true);
      expect(SESSION_CONFIG.sameSite).toBe('lax');
      expect(SESSION_CONFIG.path).toBe('/');
    });
  });

  describe('createSession', () => {
    it('should create a new session with unique ID', async () => {
      const sessionId1 = await createSession(mockUser);
      const sessionId2 = await createSession(mockUser);
      
      expect(sessionId1).toBeTruthy();
      expect(sessionId2).toBeTruthy();
      expect(sessionId1).not.toBe(sessionId2);
      expect(sessionId1.length).toBe(32); // nanoid default length
    });

    it('should store session with correct expiration time', async () => {
      const before = Date.now();
      const sessionId = await createSession(mockUser);
      const after = Date.now();
      
      const session = await getSession(sessionId);
      expect(session).toBeTruthy();
      expect(session!.userId).toBe(mockUser.id);
      
      const expectedExpiration = SESSION_CONFIG.maxAge * 1000;
      const actualExpiration = session!.expiresAt.getTime() - session!.createdAt.getTime();
      
      expect(actualExpiration).toBeCloseTo(expectedExpiration, -3); // Within 1 second
    });
  });

  describe('getSession', () => {
    it('should retrieve existing session', async () => {
      const sessionId = await createSession(mockUser);
      const session = await getSession(sessionId);
      
      expect(session).toBeTruthy();
      expect(session!.id).toBe(sessionId);
      expect(session!.user.email).toBe(mockUser.email);
    });

    it('should return null for non-existent session', async () => {
      const session = await getSession('non-existent-id');
      expect(session).toBeNull();
    });

    it('should return null for expired session', async () => {
      const sessionId = await createSession(mockUser);
      const session = await getSession(sessionId);
      
      // Manually expire the session
      if (session) {
        session.expiresAt = new Date(Date.now() - 1000);
      }
      
      const expiredSession = await getSession(sessionId);
      expect(expiredSession).toBeNull();
    });
  });

  describe('deleteSession', () => {
    it('should delete existing session', async () => {
      const sessionId = await createSession(mockUser);
      
      let session = await getSession(sessionId);
      expect(session).toBeTruthy();
      
      await deleteSession(sessionId);
      
      session = await getSession(sessionId);
      expect(session).toBeNull();
    });
  });

  describe('Cookie operations', () => {
    it('should set session cookie with correct options', () => {
      const cookies = createMockCookies();
      const sessionId = 'test-session-id';
      
      setSessionCookie(cookies, sessionId);
      
      expect(cookies.set).toHaveBeenCalledWith(
        SESSION_CONFIG.cookieName,
        sessionId,
        expect.objectContaining({
          maxAge: SESSION_CONFIG.maxAge,
          httpOnly: SESSION_CONFIG.httpOnly,
          secure: SESSION_CONFIG.secure,
          sameSite: SESSION_CONFIG.sameSite,
          path: SESSION_CONFIG.path,
        })
      );
    });

    it('should clear session cookie', () => {
      const cookies = createMockCookies();
      
      clearSessionCookie(cookies);
      
      expect(cookies.delete).toHaveBeenCalledWith(
        SESSION_CONFIG.cookieName,
        { path: SESSION_CONFIG.path }
      );
    });
  });

  describe('getCurrentUser', () => {
    it('should return user from valid session', async () => {
      const sessionId = await createSession(mockUser);
      const cookies = createMockCookies();
      
      cookies.get = vi.fn().mockReturnValue({ value: sessionId });
      
      const user = await getCurrentUser(cookies);
      expect(user).toBeTruthy();
      expect(user!.email).toBe(mockUser.email);
    });

    it('should return null when no session cookie', async () => {
      const cookies = createMockCookies();
      cookies.get = vi.fn().mockReturnValue(null);
      
      const user = await getCurrentUser(cookies);
      expect(user).toBeNull();
    });

    it('should clear invalid session cookie', async () => {
      const cookies = createMockCookies();
      cookies.get = vi.fn().mockReturnValue({ value: 'invalid-session' });
      
      const user = await getCurrentUser(cookies);
      expect(user).toBeNull();
      expect(cookies.delete).toHaveBeenCalled();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true for valid session', async () => {
      const sessionId = await createSession(mockUser);
      const cookies = createMockCookies();
      cookies.get = vi.fn().mockReturnValue({ value: sessionId });
      
      const authenticated = await isAuthenticated(cookies);
      expect(authenticated).toBe(true);
    });

    it('should return false for no session', async () => {
      const cookies = createMockCookies();
      cookies.get = vi.fn().mockReturnValue(null);
      
      const authenticated = await isAuthenticated(cookies);
      expect(authenticated).toBe(false);
    });
  });

  describe('hasRole', () => {
    it('should check contributor role correctly', async () => {
      const sessionId = await createSession(mockUser);
      const cookies = createMockCookies();
      cookies.get = vi.fn().mockReturnValue({ value: sessionId });
      
      expect(await hasRole(cookies, 'contributor')).toBe(true);
      expect(await hasRole(cookies, 'editor')).toBe(false);
      expect(await hasRole(cookies, 'admin')).toBe(false);
    });

    it('should allow admin access to all roles', async () => {
      const adminUser = { ...mockUser, role: 'admin' as const };
      const sessionId = await createSession(adminUser);
      const cookies = createMockCookies();
      cookies.get = vi.fn().mockReturnValue({ value: sessionId });
      
      expect(await hasRole(cookies, 'contributor')).toBe(true);
      expect(await hasRole(cookies, 'editor')).toBe(true);
      expect(await hasRole(cookies, 'admin')).toBe(true);
    });

    it('should allow editor access to contributor role', async () => {
      const editorUser = { ...mockUser, role: 'editor' as const };
      const sessionId = await createSession(editorUser);
      const cookies = createMockCookies();
      cookies.get = vi.fn().mockReturnValue({ value: sessionId });
      
      expect(await hasRole(cookies, 'contributor')).toBe(true);
      expect(await hasRole(cookies, 'editor')).toBe(true);
      expect(await hasRole(cookies, 'admin')).toBe(false);
    });
  });

  describe('refreshSession', () => {
    it('should update session expiration time', async () => {
      const sessionId = await createSession(mockUser);
      const originalSession = await getSession(sessionId);
      const originalExpiration = originalSession!.expiresAt.getTime();
      
      // Wait a bit to ensure time difference
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const refreshed = await refreshSession(sessionId);
      expect(refreshed).toBe(true);
      
      const updatedSession = await getSession(sessionId);
      const updatedExpiration = updatedSession!.expiresAt.getTime();
      
      expect(updatedExpiration).toBeGreaterThan(originalExpiration);
    });

    it('should return false for non-existent session', async () => {
      const refreshed = await refreshSession('non-existent');
      expect(refreshed).toBe(false);
    });
  });

  describe('CSRF Protection', () => {
    it('should generate unique CSRF tokens', () => {
      const token1 = generateCSRFToken();
      const token2 = generateCSRFToken();
      
      expect(token1).toBeTruthy();
      expect(token2).toBeTruthy();
      expect(token1).not.toBe(token2);
      expect(token1.length).toBe(32);
    });

    it('should store and validate CSRF token', async () => {
      const sessionId = await createSession(mockUser);
      const token = generateCSRFToken();
      
      await storeCSRFToken(sessionId, token);
      
      const isValid = await validateCSRFToken(sessionId, token);
      expect(isValid).toBe(true);
      
      const isInvalid = await validateCSRFToken(sessionId, 'wrong-token');
      expect(isInvalid).toBe(false);
    });

    it('should return false for non-existent session', async () => {
      const isValid = await validateCSRFToken('non-existent', 'any-token');
      expect(isValid).toBe(false);
    });
  });

  describe('cleanupExpiredSessions', () => {
    it('should remove expired sessions', async () => {
      // Create multiple sessions
      const session1 = await createSession(mockUser);
      const session2 = await createSession({ ...mockUser, id: '456' });
      const session3 = await createSession({ ...mockUser, id: '789' });
      
      // Manually expire session2
      const expiredSession = await getSession(session2);
      if (expiredSession) {
        expiredSession.expiresAt = new Date(Date.now() - 1000);
      }
      
      const cleaned = await cleanupExpiredSessions();
      expect(cleaned).toBe(1);
      
      // Verify sessions
      expect(await getSession(session1)).toBeTruthy();
      expect(await getSession(session2)).toBeNull();
      expect(await getSession(session3)).toBeTruthy();
    });
  });
});