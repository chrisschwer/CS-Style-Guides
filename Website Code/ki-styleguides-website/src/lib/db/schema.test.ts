import { describe, it, expect } from 'vitest';
import {
  isValidRole,
  isValidProvider,
  isValidStatus,
  DEFAULT_USER_ROLE,
  DEFAULT_CONTRIBUTION_STATUS,
  TABLE_NAMES,
  INDEXES,
  type User,
  type Contribution,
  type Session,
  type EmailPreference,
  type AuditLog
} from './schema';

describe('Database Schema', () => {
  describe('Type Guards', () => {
    describe('isValidRole', () => {
      it('should return true for valid roles', () => {
        expect(isValidRole('contributor')).toBe(true);
        expect(isValidRole('editor')).toBe(true);
        expect(isValidRole('admin')).toBe(true);
      });

      it('should return false for invalid roles', () => {
        expect(isValidRole('superadmin')).toBe(false);
        expect(isValidRole('user')).toBe(false);
        expect(isValidRole('')).toBe(false);
        expect(isValidRole('ADMIN')).toBe(false);
      });
    });

    describe('isValidProvider', () => {
      it('should return true for valid providers', () => {
        expect(isValidProvider('google')).toBe(true);
        expect(isValidProvider('github')).toBe(true);
      });

      it('should return false for invalid providers', () => {
        expect(isValidProvider('facebook')).toBe(false);
        expect(isValidProvider('twitter')).toBe(false);
        expect(isValidProvider('')).toBe(false);
        expect(isValidProvider('GOOGLE')).toBe(false);
      });
    });

    describe('isValidStatus', () => {
      it('should return true for valid statuses', () => {
        expect(isValidStatus('draft')).toBe(true);
        expect(isValidStatus('pending')).toBe(true);
        expect(isValidStatus('approved')).toBe(true);
        expect(isValidStatus('rejected')).toBe(true);
      });

      it('should return false for invalid statuses', () => {
        expect(isValidStatus('published')).toBe(false);
        expect(isValidStatus('deleted')).toBe(false);
        expect(isValidStatus('')).toBe(false);
        expect(isValidStatus('APPROVED')).toBe(false);
      });
    });
  });

  describe('Default Values', () => {
    it('should have correct default user role', () => {
      expect(DEFAULT_USER_ROLE).toBe('contributor');
    });

    it('should have correct default contribution status', () => {
      expect(DEFAULT_CONTRIBUTION_STATUS).toBe('draft');
    });
  });

  describe('Table Names', () => {
    it('should have all required table names', () => {
      expect(TABLE_NAMES.users).toBe('users');
      expect(TABLE_NAMES.contributions).toBe('contributions');
      expect(TABLE_NAMES.sessions).toBe('sessions');
      expect(TABLE_NAMES.emailPreferences).toBe('email_preferences');
      expect(TABLE_NAMES.auditLogs).toBe('audit_logs');
    });

    it('should be immutable', () => {
      expect(() => {
        // @ts-expect-error - Testing immutability
        TABLE_NAMES.users = 'modified';
      }).toThrow();
    });
  });

  describe('Indexes', () => {
    it('should have correct indexes for users table', () => {
      expect(INDEXES.users).toEqual(['email', 'provider']);
    });

    it('should have correct indexes for contributions table', () => {
      expect(INDEXES.contributions).toEqual(['userId', 'status', 'createdAt']);
    });

    it('should have correct indexes for sessions table', () => {
      expect(INDEXES.sessions).toEqual(['userId', 'expiresAt']);
    });

    it('should have correct indexes for audit logs table', () => {
      expect(INDEXES.auditLogs).toEqual(['userId', 'action', 'createdAt']);
    });
  });

  describe('Type Definitions', () => {
    it('should correctly type User interface', () => {
      const user: User = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        provider: 'google',
        role: 'contributor',
        blocked: false,
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      expect(user.email).toBe('test@example.com');
      expect(user.provider).toBe('google');
      expect(user.role).toBe('contributor');
    });

    it('should correctly type Contribution interface', () => {
      const contribution: Contribution = {
        id: '456',
        userId: '123',
        title: 'New Style Guide',
        filename: 'new-guide.md',
        content: '# New Guide\n\nContent here...',
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      expect(contribution.status).toBe('draft');
      expect(contribution.prNumber).toBeUndefined();
    });

    it('should correctly type Session interface', () => {
      const session: Session = {
        id: '789',
        userId: '123',
        expiresAt: new Date(Date.now() + 86400000), // 24 hours
        createdAt: new Date()
      };

      expect(session.userId).toBe('123');
    });

    it('should correctly type EmailPreference interface', () => {
      const prefs: EmailPreference = {
        userId: '123',
        notifyOnStatusChange: true,
        notifyOnNewFeatures: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      expect(prefs.notifyOnStatusChange).toBe(true);
      expect(prefs.notifyOnNewFeatures).toBe(false);
    });

    it('should correctly type AuditLog interface', () => {
      const log: AuditLog = {
        id: '999',
        userId: '123',
        action: 'user_blocked',
        targetId: '456',
        details: { reason: 'Spam' },
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        createdAt: new Date()
      };

      expect(log.action).toBe('user_blocked');
      expect(log.details.reason).toBe('Spam');
    });
  });
});