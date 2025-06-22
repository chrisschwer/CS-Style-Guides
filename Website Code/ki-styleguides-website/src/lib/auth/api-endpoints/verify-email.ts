/**
 * Email verification API endpoint
 * Handles email verification token validation
 */

import type { APIRoute } from 'astro';
import { markEmailAsVerified } from '../../../lib/auth/email-verification';

// Exclude from static generation - this is a server endpoint
export const prerender = false;

export const GET: APIRoute = async ({ url, redirect }) => {
  const token = url.searchParams.get('token');
  
  if (!token) {
    return redirect('/sign-in?error=missing_token');
  }
  
  const result = await markEmailAsVerified(token);
  
  if (!result.success) {
    // Map specific errors to user-friendly messages
    let errorCode = 'verification_failed';
    if (result.error?.includes('expired')) {
      errorCode = 'token_expired';
    } else if (result.error?.includes('attempts')) {
      errorCode = 'too_many_attempts';
    }
    
    return redirect(`/sign-in?error=${errorCode}`);
  }
  
  // Email verified successfully
  return redirect('/sign-in?verified=true');
};