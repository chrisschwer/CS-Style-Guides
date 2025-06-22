/**
 * Database schema for the Community Contribution Editor
 * Defines the structure for users and contributions
 */

export interface User {
  id: string;
  email: string;
  name: string;
  provider: 'google' | 'github';
  role: 'contributor' | 'editor' | 'admin';
  blocked: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contribution {
  id: string;
  userId: string;
  title: string;
  filename: string;
  content: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  prNumber?: number;
  prUrl?: string;
  branch?: string;
  reviewNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface EmailPreference {
  userId: string;
  notifyOnStatusChange: boolean;
  notifyOnNewFeatures: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: 'user_blocked' | 'user_unblocked' | 'role_changed' | 'contribution_reviewed';
  targetId?: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// Type guards
export function isValidRole(role: string): role is User['role'] {
  return ['contributor', 'editor', 'admin'].includes(role);
}

export function isValidProvider(provider: string): provider is User['provider'] {
  return ['google', 'github'].includes(provider);
}

export function isValidStatus(status: string): status is Contribution['status'] {
  return ['draft', 'pending', 'approved', 'rejected'].includes(status);
}

// Default values
export const DEFAULT_USER_ROLE: User['role'] = 'contributor';
export const DEFAULT_CONTRIBUTION_STATUS: Contribution['status'] = 'draft';

// Database table names (for SQL/ORM setup)
export const TABLE_NAMES = {
  users: 'users',
  contributions: 'contributions',
  sessions: 'sessions',
  emailPreferences: 'email_preferences',
  auditLogs: 'audit_logs'
} as const;

// Indexes for performance
export const INDEXES = {
  users: ['email', 'provider'],
  contributions: ['userId', 'status', 'createdAt'],
  sessions: ['userId', 'expiresAt'],
  auditLogs: ['userId', 'action', 'createdAt']
} as const;