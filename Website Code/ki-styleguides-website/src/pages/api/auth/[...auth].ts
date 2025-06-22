/**
 * Authentication API endpoints
 * Handles login, logout, and OAuth callbacks
 */

import type { APIRoute } from 'astro';
import { 
  createSession, 
  deleteSession, 
  setSessionCookie, 
  clearSessionCookie,
  getCurrentUser,
  generateCSRFToken,
  storeCSRFToken,
  type User 
} from '../../../lib/auth/session';
import type { Session } from '../../../lib/db/schema';

// Mock OAuth provider verification (replace with actual OAuth implementation)
async function verifyOAuthCallback(
  provider: string,
  code: string,
  state: string
): Promise<User | null> {
  // In production, this would:
  // 1. Exchange code for access token
  // 2. Fetch user info from provider
  // 3. Create or update user in database
  // 4. Return user object
  
  // For now, return mock user for testing
  if (code && state && (provider === 'google' || provider === 'github')) {
    return {
      id: `${provider}-${Date.now()}`,
      email: `test@${provider}.com`,
      name: 'Test User',
      provider: provider as 'google' | 'github',
      role: 'contributor',
      blocked: false,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
  
  return null;
}

export const GET: APIRoute = async ({ params, url, cookies, redirect }) => {
  const segments = params.auth?.split('/') || [];
  const action = segments[0];
  
  switch (action) {
    case 'login': {
      // Generate CSRF state token
      const state = generateCSRFToken();
      const provider = url.searchParams.get('provider');
      
      if (!provider || (provider !== 'google' && provider !== 'github')) {
        return new Response('Invalid provider', { status: 400 });
      }
      
      // Store state in cookie for CSRF validation
      cookies.set('oauth-state', state, {
        httpOnly: true,
        secure: import.meta.env.PROD,
        sameSite: 'lax',
        maxAge: 600, // 10 minutes
        path: '/',
      });
      
      // In production, redirect to OAuth provider
      // For now, simulate OAuth flow
      const callbackUrl = new URL('/api/auth/callback', url.origin);
      callbackUrl.searchParams.set('provider', provider);
      callbackUrl.searchParams.set('code', 'mock-auth-code');
      callbackUrl.searchParams.set('state', state);
      
      return redirect(callbackUrl.toString());
    }
    
    case 'callback': {
      // OAuth callback handling
      const provider = url.searchParams.get('provider');
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const error = url.searchParams.get('error');
      
      if (error) {
        return redirect('/sign-in?error=oauth_error');
      }
      
      // Verify CSRF state
      const storedState = cookies.get('oauth-state')?.value;
      if (!state || state !== storedState) {
        return redirect('/sign-in?error=invalid_state');
      }
      
      // Clear state cookie
      cookies.delete('oauth-state', { path: '/' });
      
      if (!provider || !code) {
        return redirect('/sign-in?error=missing_params');
      }
      
      // Verify OAuth callback and get user
      const user = await verifyOAuthCallback(provider, code, state);
      
      if (!user) {
        return redirect('/sign-in?error=auth_failed');
      }
      
      if (user.blocked) {
        return redirect('/sign-in?error=account_blocked');
      }
      
      // Create session
      const sessionId = await createSession(user);
      setSessionCookie(cookies, sessionId);
      
      // Generate and store CSRF token for forms
      const csrfToken = generateCSRFToken();
      await storeCSRFToken(sessionId, csrfToken);
      
      // Redirect to dashboard or return URL
      const returnUrl = cookies.get('return-url')?.value || '/dashboard';
      cookies.delete('return-url', { path: '/' });
      
      return redirect(returnUrl);
    }
    
    case 'logout': {
      // Get current session
      const user = await getCurrentUser(cookies);
      
      if (user) {
        // Delete session from store
        const sessionCookie = cookies.get('ki-styleguides-session');
        if (sessionCookie) {
          await deleteSession(sessionCookie.value);
        }
      }
      
      // Clear session cookie
      clearSessionCookie(cookies);
      
      // Redirect to home page
      return redirect('/');
    }
    
    case 'session': {
      // Check current session status
      const user = await getCurrentUser(cookies);
      
      if (!user) {
        return new Response(JSON.stringify({ authenticated: false }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
      
      return new Response(
        JSON.stringify({
          authenticated: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            provider: user.provider,
          },
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    
    default:
      return new Response('Not found', { status: 404 });
  }
};

export const POST: APIRoute = async ({ params, request, cookies }) => {
  const segments = params.auth?.split('/') || [];
  const action = segments[0];
  
  if (action === 'logout') {
    // Alternative logout via POST (for forms)
    const user = await getCurrentUser(cookies);
    
    if (user) {
      const sessionCookie = cookies.get('ki-styleguides-session');
      if (sessionCookie) {
        await deleteSession(sessionCookie.value);
      }
    }
    
    clearSessionCookie(cookies);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  
  return new Response('Not found', { status: 404 });
};