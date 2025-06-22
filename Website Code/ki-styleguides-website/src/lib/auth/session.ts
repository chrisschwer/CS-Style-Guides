/**
 * Session management with secure cookies
 * Handles user sessions, verification, and secure cookie operations
 */

import type { AstroCookie, AstroCookies } from 'astro';
import { nanoid } from 'nanoid';
import type { User, Session } from '../db/schema';

// Session configuration
export const SESSION_CONFIG = {
  cookieName: 'ki-styleguides-session',
  maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
  secure: import.meta.env.PROD, // HTTPS only in production
  httpOnly: true, // Prevent JavaScript access
  sameSite: 'lax' as const, // CSRF protection
  path: '/',
} as const;

// In-memory session store (replace with database in production)
// This is temporary until database integration is complete
const sessionStore = new Map<string, Session & { user: User }>();

/**
 * Creates a new session for a user
 */
export async function createSession(user: User): Promise<string> {
  const sessionId = nanoid(32);
  const expiresAt = new Date(Date.now() + SESSION_CONFIG.maxAge * 1000);
  
  const session: Session & { user: User } = {
    id: sessionId,
    userId: user.id,
    expiresAt,
    createdAt: new Date(),
    user,
  };
  
  // Store session (in-memory for now, should be database)
  sessionStore.set(sessionId, session);
  
  return sessionId;
}

/**
 * Retrieves a session by ID
 */
export async function getSession(sessionId: string): Promise<(Session & { user: User }) | null> {
  const session = sessionStore.get(sessionId);
  
  if (!session) {
    return null;
  }
  
  // Check if session is expired
  if (session.expiresAt < new Date()) {
    sessionStore.delete(sessionId);
    return null;
  }
  
  return session;
}

/**
 * Deletes a session
 */
export async function deleteSession(sessionId: string): Promise<void> {
  sessionStore.delete(sessionId);
}

/**
 * Sets the session cookie
 */
export function setSessionCookie(cookies: AstroCookies, sessionId: string): void {
  cookies.set(SESSION_CONFIG.cookieName, sessionId, {
    maxAge: SESSION_CONFIG.maxAge,
    httpOnly: SESSION_CONFIG.httpOnly,
    secure: SESSION_CONFIG.secure,
    sameSite: SESSION_CONFIG.sameSite,
    path: SESSION_CONFIG.path,
  });
}

/**
 * Clears the session cookie
 */
export function clearSessionCookie(cookies: AstroCookies): void {
  cookies.delete(SESSION_CONFIG.cookieName, {
    path: SESSION_CONFIG.path,
  });
}

/**
 * Gets the current user from the session
 */
export async function getCurrentUser(cookies: AstroCookies): Promise<User | null> {
  const sessionCookie = cookies.get(SESSION_CONFIG.cookieName);
  
  if (!sessionCookie) {
    return null;
  }
  
  const sessionId = sessionCookie.value;
  const session = await getSession(sessionId);
  
  if (!session) {
    // Clear invalid cookie
    clearSessionCookie(cookies);
    return null;
  }
  
  return session.user;
}

/**
 * Checks if a user is authenticated
 */
export async function isAuthenticated(cookies: AstroCookies): Promise<boolean> {
  const user = await getCurrentUser(cookies);
  return user !== null;
}

/**
 * Checks if a user has a specific role
 */
export async function hasRole(cookies: AstroCookies, requiredRole: User['role']): Promise<boolean> {
  const user = await getCurrentUser(cookies);
  
  if (!user) {
    return false;
  }
  
  // Admin has access to everything
  if (user.role === 'admin') {
    return true;
  }
  
  // Editor has access to editor and contributor roles
  if (user.role === 'editor' && requiredRole !== 'admin') {
    return true;
  }
  
  // Check exact role match
  return user.role === requiredRole;
}

/**
 * Refreshes a session expiration time
 */
export async function refreshSession(sessionId: string): Promise<boolean> {
  const session = sessionStore.get(sessionId);
  
  if (!session) {
    return false;
  }
  
  // Update expiration time
  session.expiresAt = new Date(Date.now() + SESSION_CONFIG.maxAge * 1000);
  sessionStore.set(sessionId, session);
  
  return true;
}

/**
 * Validates CSRF token for form submissions
 */
export function generateCSRFToken(): string {
  return nanoid(32);
}

/**
 * Stores CSRF token in session
 */
export async function storeCSRFToken(sessionId: string, token: string): Promise<void> {
  const session = sessionStore.get(sessionId);
  if (session) {
    // Add CSRF token to session data
    (session as any).csrfToken = token;
    sessionStore.set(sessionId, session);
  }
}

/**
 * Validates CSRF token from request
 */
export async function validateCSRFToken(sessionId: string, token: string): Promise<boolean> {
  const session = sessionStore.get(sessionId);
  if (!session) {
    return false;
  }
  
  const storedToken = (session as any).csrfToken;
  return storedToken === token;
}

/**
 * Cleanup expired sessions (should be called periodically)
 */
export async function cleanupExpiredSessions(): Promise<number> {
  const now = new Date();
  let cleaned = 0;
  
  for (const [sessionId, session] of sessionStore.entries()) {
    if (session.expiresAt < now) {
      sessionStore.delete(sessionId);
      cleaned++;
    }
  }
  
  return cleaned;
}

// Test helpers - only exposed for testing
export const __testHelpers = {
  clearStore: () => {
    sessionStore.clear();
  }
};

// Export types
export type { Session, User };