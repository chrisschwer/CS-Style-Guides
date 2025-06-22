/**
 * Global middleware configuration
 * Handles authentication checks for protected routes
 */

import { defineMiddleware } from 'astro:middleware';
import { authMiddleware } from './lib/auth/middleware';

// Export the authentication middleware
export const onRequest = defineMiddleware(authMiddleware);