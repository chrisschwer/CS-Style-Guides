import type { Provider } from '@auth/core/providers';
import Google from '@auth/core/providers/google';
import GitHub from '@auth/core/providers/github';

/**
 * Configure Google OAuth provider with minimal scopes
 * Only requests email and basic profile information
 */
export function getGoogleProvider(): Provider {
  if (!process.env.AUTH_GOOGLE_ID || !process.env.AUTH_GOOGLE_SECRET) {
    throw new Error('Google OAuth credentials not configured. Please set AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET in your .env file');
  }

  return Google({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
    authorization: {
      params: {
        prompt: "consent",
        access_type: "offline", 
        response_type: "code",
        scope: "openid email profile" // Minimal scope: only email and name
      }
    },
    // Map the minimal profile data we need
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
        provider: 'google'
      };
    }
  });
}

/**
 * Configure GitHub OAuth provider with minimal scopes
 * Only requests read access to user profile and email
 */
export function getGitHubProvider(): Provider {
  if (!process.env.AUTH_GITHUB_ID || !process.env.AUTH_GITHUB_SECRET) {
    throw new Error('GitHub OAuth credentials not configured. Please set AUTH_GITHUB_ID and AUTH_GITHUB_SECRET in your .env file');
  }

  return GitHub({
    clientId: process.env.AUTH_GITHUB_ID,
    clientSecret: process.env.AUTH_GITHUB_SECRET,
    authorization: {
      params: {
        scope: "read:user user:email" // Minimal scope: only user profile and email
      }
    },
    // Map the minimal profile data we need
    profile(profile) {
      return {
        id: profile.id.toString(),
        name: profile.name || profile.login,
        email: profile.email,
        image: profile.avatar_url,
        provider: 'github'
      };
    }
  });
}

/**
 * Get all configured OAuth providers
 */
export function getProviders(): Provider[] {
  const providers: Provider[] = [];
  
  // Add Google provider if configured
  try {
    providers.push(getGoogleProvider());
  } catch (error) {
    console.warn('Google OAuth not configured:', error.message);
  }
  
  // Add GitHub provider if configured
  try {
    providers.push(getGitHubProvider());
  } catch (error) {
    console.warn('GitHub OAuth not configured:', error.message);
  }
  
  return providers;
}