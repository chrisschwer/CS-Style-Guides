import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  authMiddleware,
  requireAuth,
  AuthGuard,
  getRouteProtection,
  canAccessRoute,
  type AuthOptions,
} from './middleware';
import type { User } from '../db/schema';

// Mock the session module
vi.mock('./session', () => ({
  getCurrentUser: vi.fn(),
  hasRole: vi.fn(),
}));

import { getCurrentUser, hasRole } from './session';

// Mock user objects
const mockContributor: User = {
  id: '1',
  email: 'contributor@example.com',
  name: 'Contributor',
  provider: 'google',
  role: 'contributor',
  blocked: false,
  emailVerified: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockEditor: User = {
  ...mockContributor,
  id: '2',
  email: 'editor@example.com',
  name: 'Editor',
  role: 'editor',
};

const mockAdmin: User = {
  ...mockContributor,
  id: '3',
  email: 'admin@example.com',
  name: 'Admin',
  role: 'admin',
};

const mockBlockedUser: User = {
  ...mockContributor,
  blocked: true,
};

const mockUnverifiedUser: User = {
  ...mockContributor,
  emailVerified: false,
};

// Helper to create mock context
const createMockContext = (pathname: string) => {
  const cookies = new Map();
  const mockCookies = {
    get: vi.fn((name: string) => cookies.get(name)),
    set: vi.fn((name: string, value: string, options?: any) => {
      cookies.set(name, { value, options });
    }),
    delete: vi.fn((name: string) => cookies.delete(name)),
  };

  const url = new URL(`http://localhost:4321${pathname}`);
  const redirect = vi.fn((location: string) => ({ redirect: location }));
  const next = vi.fn(() => ({ next: true }));

  return {
    context: { cookies: mockCookies, url, redirect },
    next,
    mockCookies,
  };
};

describe('Auth Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('authMiddleware', () => {
    it('should allow access to unprotected routes', async () => {
      const { context, next } = createMockContext('/');
      const result = await authMiddleware(context as any, next);
      
      expect(next).toHaveBeenCalled();
      expect(result).toEqual({ next: true });
    });

    it('should redirect unauthenticated users from protected routes', async () => {
      (getCurrentUser as any).mockResolvedValueOnce(null);
      
      const { context, next, mockCookies } = createMockContext('/dashboard');
      const result = await authMiddleware(context as any, next);
      
      expect(getCurrentUser).toHaveBeenCalledWith(mockCookies);
      expect(mockCookies.set).toHaveBeenCalledWith(
        'return-url',
        '/dashboard',
        expect.any(Object)
      );
      expect(context.redirect).toHaveBeenCalledWith('/sign-in');
      expect(next).not.toHaveBeenCalled();
    });

    it('should allow authenticated users to access basic protected routes', async () => {
      (getCurrentUser as any).mockResolvedValueOnce(mockContributor);
      
      const { context, next } = createMockContext('/dashboard');
      const result = await authMiddleware(context as any, next);
      
      expect(next).toHaveBeenCalled();
    });

    it('should redirect blocked users', async () => {
      (getCurrentUser as any).mockResolvedValueOnce(mockBlockedUser);
      
      const { context, next } = createMockContext('/dashboard');
      const result = await authMiddleware(context as any, next);
      
      expect(context.redirect).toHaveBeenCalledWith('/sign-in?error=account_blocked');
      expect(next).not.toHaveBeenCalled();
    });

    it('should redirect unverified users from routes requiring verification', async () => {
      (getCurrentUser as any).mockResolvedValueOnce(mockUnverifiedUser);
      
      const { context, next } = createMockContext('/editor');
      const result = await authMiddleware(context as any, next);
      
      expect(context.redirect).toHaveBeenCalledWith('/verify-email');
      expect(next).not.toHaveBeenCalled();
    });

    it('should check role requirements', async () => {
      (getCurrentUser as any).mockResolvedValueOnce(mockContributor);
      (hasRole as any).mockResolvedValueOnce(false);
      
      const { context, next } = createMockContext('/admin');
      const result = await authMiddleware(context as any, next);
      
      expect(hasRole).toHaveBeenCalledWith(context.cookies, 'admin');
      expect(context.redirect).toHaveBeenCalledWith('/unauthorized');
      expect(next).not.toHaveBeenCalled();
    });

    it('should allow users with required role', async () => {
      (getCurrentUser as any).mockResolvedValueOnce(mockAdmin);
      (hasRole as any).mockResolvedValueOnce(true);
      
      const { context, next } = createMockContext('/admin');
      const result = await authMiddleware(context as any, next);
      
      expect(next).toHaveBeenCalled();
    });

    it('should handle nested routes', async () => {
      (getCurrentUser as any).mockResolvedValueOnce(mockContributor);
      
      const { context, next } = createMockContext('/editor/new-guide');
      const result = await authMiddleware(context as any, next);
      
      expect(next).toHaveBeenCalled();
    });
  });

  describe('requireAuth', () => {
    it('should return user when authenticated', async () => {
      (getCurrentUser as any).mockResolvedValueOnce(mockContributor);
      
      const result = await requireAuth({} as any);
      
      expect(result.user).toEqual(mockContributor);
      expect(result.redirect).toBeUndefined();
    });

    it('should return redirect when not authenticated', async () => {
      (getCurrentUser as any).mockResolvedValueOnce(null);
      
      const result = await requireAuth({} as any);
      
      expect(result.user).toBeNull();
      expect(result.redirect).toBe('/sign-in');
    });

    it('should use custom redirect', async () => {
      (getCurrentUser as any).mockResolvedValueOnce(null);
      
      const result = await requireAuth({} as any, { redirectTo: '/custom' });
      
      expect(result.redirect).toBe('/custom');
    });

    it('should check email verification', async () => {
      (getCurrentUser as any).mockResolvedValueOnce(mockUnverifiedUser);
      
      const result = await requireAuth({} as any, { requireEmailVerified: true });
      
      expect(result.redirect).toBe('/verify-email');
    });

    it('should check role requirements', async () => {
      (getCurrentUser as any).mockResolvedValueOnce(mockContributor);
      (hasRole as any).mockResolvedValueOnce(false);
      
      const result = await requireAuth({} as any, { requireRole: 'admin' });
      
      expect(result.redirect).toBe('/unauthorized');
    });
  });

  describe('AuthGuard', () => {
    it('should render children when user is authenticated', () => {
      const result = AuthGuard({
        user: mockContributor,
        children: 'Protected Content',
      });
      
      expect(result).toBe('Protected Content');
    });

    it('should render fallback when user is not authenticated', () => {
      const result = AuthGuard({
        user: null,
        children: 'Protected Content',
        fallback: 'Please login',
      });
      
      expect(result).toBe('Please login');
    });

    it('should check role requirements', () => {
      const result = AuthGuard({
        user: mockContributor,
        role: 'admin',
        children: 'Admin Content',
        fallback: 'Not authorized',
      });
      
      expect(result).toBe('Not authorized');
    });

    it('should allow admin access to all roles', () => {
      const result = AuthGuard({
        user: mockAdmin,
        role: 'editor',
        children: 'Editor Content',
      });
      
      expect(result).toBe('Editor Content');
    });

    it('should allow editor access to contributor role', () => {
      const result = AuthGuard({
        user: mockEditor,
        role: 'contributor',
        children: 'Contributor Content',
      });
      
      expect(result).toBe('Contributor Content');
    });
  });

  describe('getRouteProtection', () => {
    it('should return protection config for exact match', () => {
      const protection = getRouteProtection('/dashboard');
      expect(protection).toEqual({ requireAuth: true });
    });

    it('should return protection config for prefix match', () => {
      const protection = getRouteProtection('/editor/new-guide');
      expect(protection).toEqual({ requireAuth: true, requireEmailVerified: true });
    });

    it('should return null for unprotected routes', () => {
      const protection = getRouteProtection('/about');
      expect(protection).toBeNull();
    });
  });

  describe('canAccessRoute', () => {
    it('should allow access to unprotected routes', async () => {
      const canAccess = await canAccessRoute(null, '/');
      expect(canAccess).toBe(true);
    });

    it('should deny access to protected routes without auth', async () => {
      const canAccess = await canAccessRoute(null, '/dashboard');
      expect(canAccess).toBe(false);
    });

    it('should allow authenticated users to access protected routes', async () => {
      const canAccess = await canAccessRoute(mockContributor, '/dashboard');
      expect(canAccess).toBe(true);
    });

    it('should deny blocked users', async () => {
      const canAccess = await canAccessRoute(mockBlockedUser, '/dashboard');
      expect(canAccess).toBe(false);
    });

    it('should check email verification', async () => {
      const canAccess = await canAccessRoute(mockUnverifiedUser, '/editor');
      expect(canAccess).toBe(false);
    });

    it('should check role requirements', async () => {
      const canAccess = await canAccessRoute(mockContributor, '/admin');
      expect(canAccess).toBe(false);
      
      const canAccessAdmin = await canAccessRoute(mockAdmin, '/admin');
      expect(canAccessAdmin).toBe(true);
    });

    it('should respect role hierarchy', async () => {
      const editorCanAccessContributor = await canAccessRoute(mockEditor, '/dashboard');
      expect(editorCanAccessContributor).toBe(true);
      
      const adminCanAccessEditor = await canAccessRoute(mockAdmin, '/admin/contributions');
      expect(adminCanAccessEditor).toBe(true);
    });
  });
});