/**
 * Integration tests for the complete authentication flow
 * Tests the interaction between all auth components
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { User } from '../db/schema';

// Import all auth modules
import {
  createSession,
  deleteSession,
  setSessionCookie,
  clearSessionCookie,
  getCurrentUser,
  isAuthenticated,
  hasRole,
  generateCSRFToken,
  validateCSRFToken,
} from './session';

import {
  generateVerificationToken,
  validateVerificationToken,
  markEmailAsVerified,
  needsEmailVerification,
} from './email-verification';

import {
  authMiddleware,
  requireAuth,
  canAccessRoute,
} from './middleware';

// Mock user data
const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: '123',
  email: 'test@example.com',
  name: 'Test User',
  provider: 'google',
  role: 'contributor',
  blocked: false,
  emailVerified: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

// Mock cookie store
class MockCookieStore {
  private store = new Map<string, { value: string; options?: any }>();

  get(name: string) {
    const cookie = this.store.get(name);
    return cookie ? { value: cookie.value } : undefined;
  }

  set(name: string, value: string, options?: any) {
    this.store.set(name, { value, options });
  }

  delete(name: string) {
    this.store.delete(name);
  }

  has(name: string) {
    return this.store.has(name);
  }

  clear() {
    this.store.clear();
  }
}

describe('Authentication Flow Integration', () => {
  let mockCookies: MockCookieStore;

  beforeEach(() => {
    mockCookies = new MockCookieStore();
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up any sessions created during tests
    mockCookies.clear();
  });

  describe('Complete Login Flow', () => {
    it('should handle successful OAuth login flow', async () => {
      const user = createMockUser();
      
      // Step 1: User initiates login
      const csrfState = generateCSRFToken();
      expect(csrfState).toBeTruthy();
      expect(csrfState.length).toBe(32);
      
      // Step 2: OAuth callback creates session
      const sessionId = await createSession(user);
      expect(sessionId).toBeTruthy();
      
      // Step 3: Set session cookie
      setSessionCookie(mockCookies as any, sessionId);
      expect(mockCookies.get('ki-styleguides-session')).toBeTruthy();
      
      // Step 4: Verify user is authenticated
      const currentUser = await getCurrentUser(mockCookies as any);
      expect(currentUser).toEqual(user);
      
      const isAuth = await isAuthenticated(mockCookies as any);
      expect(isAuth).toBe(true);
      
      // Step 5: Check email verification not needed for OAuth
      expect(needsEmailVerification(user)).toBe(false);
    });

    it('should handle email-based registration with verification', async () => {
      const user = createMockUser({
        provider: 'email' as any,
        emailVerified: false,
      });
      
      // Step 1: Create unverified user session
      const sessionId = await createSession(user);
      setSessionCookie(mockCookies as any, sessionId);
      
      // Step 2: Check user needs verification
      expect(needsEmailVerification(user)).toBe(true);
      
      // Step 3: Generate verification token
      const token = await generateVerificationToken(user);
      expect(token).toBeTruthy();
      
      // Step 4: Validate token
      const validation = await validateVerificationToken(token);
      expect(validation.valid).toBe(true);
      expect(validation.userId).toBe(user.id);
      
      // Step 5: Mark email as verified
      const result = await markEmailAsVerified(token);
      expect(result.success).toBe(true);
      expect(result.userId).toBe(user.id);
    });
  });

  describe('Protected Route Access', () => {
    it('should allow authenticated user to access protected route', async () => {
      const user = createMockUser();
      const sessionId = await createSession(user);
      setSessionCookie(mockCookies as any, sessionId);
      
      // Check access to dashboard
      const canAccess = await canAccessRoute(user, '/dashboard');
      expect(canAccess).toBe(true);
      
      // Use requireAuth helper
      const authCheck = await requireAuth(mockCookies as any);
      expect(authCheck.user).toEqual(user);
      expect(authCheck.redirect).toBeUndefined();
    });

    it('should deny unauthenticated access to protected route', async () => {
      // No session created
      const canAccess = await canAccessRoute(null, '/dashboard');
      expect(canAccess).toBe(false);
      
      const authCheck = await requireAuth(mockCookies as any);
      expect(authCheck.user).toBeNull();
      expect(authCheck.redirect).toBe('/sign-in');
    });

    it('should enforce role-based access control', async () => {
      // Contributor trying to access admin route
      const contributor = createMockUser({ role: 'contributor' });
      const sessionId = await createSession(contributor);
      setSessionCookie(mockCookies as any, sessionId);
      
      const canAccessAdmin = await canAccessRoute(contributor, '/admin');
      expect(canAccessAdmin).toBe(false);
      
      const hasAdminRole = await hasRole(mockCookies as any, 'admin');
      expect(hasAdminRole).toBe(false);
      
      // Admin accessing admin route
      const admin = createMockUser({ role: 'admin' });
      const adminSessionId = await createSession(admin);
      mockCookies.clear();
      setSessionCookie(mockCookies as any, adminSessionId);
      
      const adminCanAccess = await canAccessRoute(admin, '/admin');
      expect(adminCanAccess).toBe(true);
      
      const adminHasRole = await hasRole(mockCookies as any, 'admin');
      expect(adminHasRole).toBe(true);
    });

    it('should block access for blocked users', async () => {
      const blockedUser = createMockUser({ blocked: true });
      const sessionId = await createSession(blockedUser);
      setSessionCookie(mockCookies as any, sessionId);
      
      const canAccess = await canAccessRoute(blockedUser, '/dashboard');
      expect(canAccess).toBe(false);
      
      const authCheck = await requireAuth(mockCookies as any);
      expect(authCheck.redirect).toBe('/sign-in?error=account_blocked');
    });

    it('should require email verification for specific routes', async () => {
      const unverifiedUser = createMockUser({ emailVerified: false });
      const sessionId = await createSession(unverifiedUser);
      setSessionCookie(mockCookies as any, sessionId);
      
      // Can access dashboard without verification
      const canAccessDashboard = await canAccessRoute(unverifiedUser, '/dashboard');
      expect(canAccessDashboard).toBe(true);
      
      // Cannot access editor without verification
      const canAccessEditor = await canAccessRoute(unverifiedUser, '/editor');
      expect(canAccessEditor).toBe(false);
      
      const authCheck = await requireAuth(mockCookies as any, { 
        requireEmailVerified: true 
      });
      expect(authCheck.redirect).toBe('/verify-email');
    });
  });

  describe('Logout Flow', () => {
    it('should completely clear session on logout', async () => {
      const user = createMockUser();
      const sessionId = await createSession(user);
      setSessionCookie(mockCookies as any, sessionId);
      
      // Verify logged in
      let currentUser = await getCurrentUser(mockCookies as any);
      expect(currentUser).toEqual(user);
      
      // Logout
      await deleteSession(sessionId);
      clearSessionCookie(mockCookies as any);
      
      // Verify logged out
      currentUser = await getCurrentUser(mockCookies as any);
      expect(currentUser).toBeNull();
      
      const isAuth = await isAuthenticated(mockCookies as any);
      expect(isAuth).toBe(false);
    });
  });

  describe('CSRF Protection', () => {
    it('should validate CSRF tokens correctly', async () => {
      const user = createMockUser();
      const sessionId = await createSession(user);
      
      // Generate CSRF token
      const csrfToken = generateCSRFToken();
      await vi.importActual('./session').then((mod: any) => 
        mod.storeCSRFToken(sessionId, csrfToken)
      );
      
      // Validate correct token
      const isValid = await validateCSRFToken(sessionId, csrfToken);
      expect(isValid).toBe(true);
      
      // Validate incorrect token
      const isInvalid = await validateCSRFToken(sessionId, 'wrong-token');
      expect(isInvalid).toBe(false);
    });
  });

  describe('Session Lifecycle', () => {
    it('should handle session expiration', async () => {
      const user = createMockUser();
      const sessionId = await createSession(user);
      setSessionCookie(mockCookies as any, sessionId);
      
      // Session should be valid initially
      let session = await vi.importActual('./session').then((mod: any) => 
        mod.getSession(sessionId)
      );
      expect(session).toBeTruthy();
      
      // Manually expire session
      if (session) {
        session.expiresAt = new Date(Date.now() - 1000);
      }
      
      // Should return null for expired session
      const currentUser = await getCurrentUser(mockCookies as any);
      expect(currentUser).toBeNull();
    });

    it('should refresh session expiration', async () => {
      const user = createMockUser();
      const sessionId = await createSession(user);
      
      const refreshed = await vi.importActual('./session').then((mod: any) => 
        mod.refreshSession(sessionId)
      );
      expect(refreshed).toBe(true);
    });
  });

  describe('Role Hierarchy', () => {
    it('should respect role hierarchy in access control', async () => {
      // Test contributor
      const contributor = createMockUser({ role: 'contributor' });
      expect(await canAccessRoute(contributor, '/dashboard')).toBe(true);
      expect(await canAccessRoute(contributor, '/admin/contributions')).toBe(false);
      expect(await canAccessRoute(contributor, '/admin')).toBe(false);
      
      // Test editor
      const editor = createMockUser({ role: 'editor' });
      expect(await canAccessRoute(editor, '/dashboard')).toBe(true);
      expect(await canAccessRoute(editor, '/admin/contributions')).toBe(true);
      expect(await canAccessRoute(editor, '/admin')).toBe(false);
      
      // Test admin
      const admin = createMockUser({ role: 'admin' });
      expect(await canAccessRoute(admin, '/dashboard')).toBe(true);
      expect(await canAccessRoute(admin, '/admin/contributions')).toBe(true);
      expect(await canAccessRoute(admin, '/admin')).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing session gracefully', async () => {
      const currentUser = await getCurrentUser(mockCookies as any);
      expect(currentUser).toBeNull();
      
      const isAuth = await isAuthenticated(mockCookies as any);
      expect(isAuth).toBe(false);
    });

    it('should handle invalid session ID gracefully', async () => {
      mockCookies.set('ki-styleguides-session', 'invalid-session-id', {});
      
      const currentUser = await getCurrentUser(mockCookies as any);
      expect(currentUser).toBeNull();
    });
  });
});