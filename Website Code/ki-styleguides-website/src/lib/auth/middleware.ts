/**
 * Authentication middleware for protected routes
 * Provides route protection and role-based access control
 */

import type { MiddlewareResponseHandler } from 'astro';
import { getCurrentUser, hasRole } from './session';
import type { User } from '../db/schema';

export interface AuthOptions {
  requireAuth?: boolean;
  requireRole?: User['role'];
  requireEmailVerified?: boolean;
  redirectTo?: string;
}

/**
 * Middleware to protect routes requiring authentication
 */
export const authMiddleware: MiddlewareResponseHandler = async (
  { cookies, url, redirect },
  next
) => {
  // Define protected routes and their requirements
  const protectedRoutes: Record<string, AuthOptions> = {
    '/dashboard': { requireAuth: true },
    '/editor': { requireAuth: true, requireEmailVerified: true },
    '/editor/new': { requireAuth: true, requireEmailVerified: true },
    '/editor/edit': { requireAuth: true, requireEmailVerified: true },
    '/admin': { requireAuth: true, requireRole: 'admin' },
    '/admin/contributions': { requireAuth: true, requireRole: 'editor' },
    '/admin/users': { requireAuth: true, requireRole: 'admin' },
    '/api/contributions/submit': { requireAuth: true, requireEmailVerified: true },
  };
  
  // Check if current path needs protection
  const pathname = url.pathname;
  let routeConfig: AuthOptions | undefined;
  
  // Check exact matches first
  if (protectedRoutes[pathname]) {
    routeConfig = protectedRoutes[pathname];
  } else {
    // Check prefix matches for nested routes
    for (const [route, config] of Object.entries(protectedRoutes)) {
      if (pathname.startsWith(route + '/') || pathname === route) {
        routeConfig = config;
        break;
      }
    }
  }
  
  // If route doesn't need protection, continue
  if (!routeConfig || !routeConfig.requireAuth) {
    return next();
  }
  
  // Get current user
  const user = await getCurrentUser(cookies);
  
  // Check authentication
  if (!user) {
    // Store return URL for after login
    cookies.set('return-url', pathname, {
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    });
    
    return redirect(routeConfig.redirectTo || '/sign-in');
  }
  
  // Check if user is blocked
  if (user.blocked) {
    return redirect('/sign-in?error=account_blocked');
  }
  
  // Check email verification
  if (routeConfig.requireEmailVerified && !user.emailVerified) {
    return redirect('/verify-email');
  }
  
  // Check role requirements
  if (routeConfig.requireRole) {
    const hasRequiredRole = await hasRole(cookies, routeConfig.requireRole);
    if (!hasRequiredRole) {
      return redirect('/unauthorized');
    }
  }
  
  // User is authorized, continue
  return next();
};

/**
 * Helper to check authentication in pages/components
 */
export async function requireAuth(
  cookies: any,
  options: AuthOptions = {}
): Promise<{ user: User; redirect?: string }> {
  const user = await getCurrentUser(cookies);
  
  if (!user) {
    return { 
      user: null as any, 
      redirect: options.redirectTo || '/sign-in' 
    };
  }
  
  if (user.blocked) {
    return { 
      user: null as any, 
      redirect: '/sign-in?error=account_blocked' 
    };
  }
  
  if (options.requireEmailVerified && !user.emailVerified) {
    return { 
      user: null as any, 
      redirect: '/verify-email' 
    };
  }
  
  if (options.requireRole) {
    const hasRequiredRole = await hasRole(cookies, options.requireRole);
    if (!hasRequiredRole) {
      return { 
        user: null as any, 
        redirect: '/unauthorized' 
      };
    }
  }
  
  return { user };
}

/**
 * Component helper for conditional rendering based on auth
 */
export function AuthGuard({
  user,
  role,
  children,
  fallback = null,
}: {
  user: User | null;
  role?: User['role'];
  children: any;
  fallback?: any;
}) {
  if (!user) {
    return fallback;
  }
  
  if (role) {
    // Check role hierarchy
    if (user.role === 'admin') {
      return children;
    }
    
    if (user.role === 'editor' && role !== 'admin') {
      return children;
    }
    
    if (user.role !== role) {
      return fallback;
    }
  }
  
  return children;
}

/**
 * Get protection status for a route
 */
export function getRouteProtection(pathname: string): AuthOptions | null {
  const protectedRoutes: Record<string, AuthOptions> = {
    '/dashboard': { requireAuth: true },
    '/editor': { requireAuth: true, requireEmailVerified: true },
    '/admin': { requireAuth: true, requireRole: 'admin' },
  };
  
  // Check exact match
  if (protectedRoutes[pathname]) {
    return protectedRoutes[pathname];
  }
  
  // Check prefix matches
  for (const [route, config] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route + '/')) {
      return config;
    }
  }
  
  return null;
}

/**
 * Check if user can access a route
 */
export async function canAccessRoute(
  user: User | null,
  pathname: string
): Promise<boolean> {
  const protection = getRouteProtection(pathname);
  
  if (!protection || !protection.requireAuth) {
    return true;
  }
  
  if (!user || user.blocked) {
    return false;
  }
  
  if (protection.requireEmailVerified && !user.emailVerified) {
    return false;
  }
  
  if (protection.requireRole) {
    // Role hierarchy check
    if (user.role === 'admin') {
      return true;
    }
    
    if (user.role === 'editor' && protection.requireRole !== 'admin') {
      return true;
    }
    
    return user.role === protection.requireRole;
  }
  
  return true;
}