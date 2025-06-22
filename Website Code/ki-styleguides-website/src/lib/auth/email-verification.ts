/**
 * Email verification flow for new accounts
 * Handles verification token generation, validation, and email sending
 */

import { nanoid } from 'nanoid';
import type { User } from '../db/schema';

// Verification token configuration
export const VERIFICATION_CONFIG = {
  tokenLength: 32,
  expirationHours: 24,
  maxAttempts: 3,
  cooldownMinutes: 5,
} as const;

// In-memory store for verification tokens (replace with database in production)
interface VerificationToken {
  token: string;
  userId: string;
  email: string;
  expiresAt: Date;
  attempts: number;
  createdAt: Date;
}

const verificationStore = new Map<string, VerificationToken>();
const attemptStore = new Map<string, { count: number; lastAttempt: Date }>();

/**
 * Generates a verification token for a user
 */
export async function generateVerificationToken(user: User): Promise<string> {
  // Check rate limiting
  const attempts = attemptStore.get(user.email);
  if (attempts) {
    const minutesSinceLastAttempt = 
      (Date.now() - attempts.lastAttempt.getTime()) / 1000 / 60;
    
    if (minutesSinceLastAttempt < VERIFICATION_CONFIG.cooldownMinutes) {
      throw new Error(
        `Please wait ${Math.ceil(VERIFICATION_CONFIG.cooldownMinutes - minutesSinceLastAttempt)} minutes before requesting a new verification email`
      );
    }
  }
  
  // Clear any existing tokens for this user
  for (const [key, value] of verificationStore.entries()) {
    if (value.userId === user.id) {
      verificationStore.delete(key);
    }
  }
  
  // Generate new token
  const token = nanoid(VERIFICATION_CONFIG.tokenLength);
  const expiresAt = new Date(
    Date.now() + VERIFICATION_CONFIG.expirationHours * 60 * 60 * 1000
  );
  
  const verificationToken: VerificationToken = {
    token,
    userId: user.id,
    email: user.email,
    expiresAt,
    attempts: 0,
    createdAt: new Date(),
  };
  
  verificationStore.set(token, verificationToken);
  
  // Update attempt tracking
  attemptStore.set(user.email, {
    count: (attempts?.count || 0) + 1,
    lastAttempt: new Date(),
  });
  
  return token;
}

/**
 * Validates a verification token
 */
export async function validateVerificationToken(
  token: string
): Promise<{ valid: boolean; userId?: string; error?: string }> {
  const verification = verificationStore.get(token);
  
  if (!verification) {
    return { valid: false, error: 'Invalid verification token' };
  }
  
  // Check expiration
  if (verification.expiresAt < new Date()) {
    verificationStore.delete(token);
    return { valid: false, error: 'Verification token has expired' };
  }
  
  // Check attempts
  if (verification.attempts >= VERIFICATION_CONFIG.maxAttempts) {
    verificationStore.delete(token);
    return { valid: false, error: 'Too many verification attempts' };
  }
  
  // Increment attempts
  verification.attempts++;
  verificationStore.set(token, verification);
  
  return { valid: true, userId: verification.userId };
}

/**
 * Marks a user's email as verified
 */
export async function markEmailAsVerified(
  token: string
): Promise<{ success: boolean; userId?: string; error?: string }> {
  const validation = await validateVerificationToken(token);
  
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }
  
  const verification = verificationStore.get(token);
  if (!verification) {
    return { success: false, error: 'Token not found' };
  }
  
  // In production, update user.emailVerified = true in database
  // For now, just remove the token
  verificationStore.delete(token);
  
  // Clear attempt tracking for this email
  attemptStore.delete(verification.email);
  
  return { success: true, userId: verification.userId };
}

/**
 * Generates verification email HTML content
 */
export function generateVerificationEmail(
  userName: string,
  verificationUrl: string
): { subject: string; html: string; text: string } {
  const subject = 'Bestätigen Sie Ihre E-Mail-Adresse - KI Style Guides';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1e40af; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px 20px; background-color: #f8f9fa; }
        .button { display: inline-block; padding: 12px 30px; background-color: #059669; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>KI Style Guides</h1>
        </div>
        <div class="content">
          <h2>Hallo ${userName},</h2>
          <p>Willkommen bei KI Style Guides! Bitte bestätigen Sie Ihre E-Mail-Adresse, um fortzufahren.</p>
          <p style="text-align: center;">
            <a href="${verificationUrl}" class="button">E-Mail-Adresse bestätigen</a>
          </p>
          <p>Oder kopieren Sie diesen Link in Ihren Browser:</p>
          <p style="word-break: break-all; color: #059669;">${verificationUrl}</p>
          <p><strong>Hinweis:</strong> Dieser Link ist 24 Stunden gültig.</p>
          <p>Falls Sie sich nicht registriert haben, können Sie diese E-Mail ignorieren.</p>
        </div>
        <div class="footer">
          <p>© 2025 KI Style Guides. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
Hallo ${userName},

Willkommen bei KI Style Guides! Bitte bestätigen Sie Ihre E-Mail-Adresse, um fortzufahren.

Bestätigungslink: ${verificationUrl}

Hinweis: Dieser Link ist 24 Stunden gültig.

Falls Sie sich nicht registriert haben, können Sie diese E-Mail ignorieren.

© 2025 KI Style Guides. Alle Rechte vorbehalten.
  `.trim();
  
  return { subject, html, text };
}

/**
 * Checks if a user needs email verification
 */
export function needsEmailVerification(user: User): boolean {
  // OAuth providers typically verify emails
  if (user.provider === 'google' || user.provider === 'github') {
    return false;
  }
  
  return !user.emailVerified;
}

/**
 * Cleans up expired verification tokens
 */
export async function cleanupExpiredTokens(): Promise<number> {
  const now = new Date();
  let cleaned = 0;
  
  for (const [token, verification] of verificationStore.entries()) {
    if (verification.expiresAt < now) {
      verificationStore.delete(token);
      cleaned++;
    }
  }
  
  // Clean up old attempt records
  for (const [email, attempts] of attemptStore.entries()) {
    const hoursSinceLastAttempt = 
      (now.getTime() - attempts.lastAttempt.getTime()) / 1000 / 60 / 60;
    
    if (hoursSinceLastAttempt > 24) {
      attemptStore.delete(email);
    }
  }
  
  return cleaned;
}

/**
 * Gets verification status for debugging
 */
export function getVerificationStatus(email: string): {
  hasToken: boolean;
  attempts: number;
  cooldownRemaining: number;
} {
  const attempts = attemptStore.get(email);
  let hasToken = false;
  
  for (const verification of verificationStore.values()) {
    if (verification.email === email) {
      hasToken = true;
      break;
    }
  }
  
  const cooldownRemaining = attempts
    ? Math.max(
        0,
        VERIFICATION_CONFIG.cooldownMinutes - 
        (Date.now() - attempts.lastAttempt.getTime()) / 1000 / 60
      )
    : 0;
  
  return {
    hasToken,
    attempts: attempts?.count || 0,
    cooldownRemaining: Math.ceil(cooldownRemaining),
  };
}

// Test helpers - only exposed for testing
export const __testHelpers = process.env.NODE_ENV === 'test' ? {
  clearStores: () => {
    verificationStore.clear();
    attemptStore.clear();
  }
} : undefined;