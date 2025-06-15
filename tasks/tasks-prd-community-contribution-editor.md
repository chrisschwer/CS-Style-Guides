## Relevant Files

- `src/lib/auth/providers.ts` - OAuth provider configuration for Google and GitHub
- `src/lib/auth/providers.test.ts` - Unit tests for OAuth providers
- `src/lib/auth/session.ts` - Session management and user verification
- `src/lib/auth/session.test.ts` - Unit tests for session management
- `src/pages/api/auth/[...auth].ts` - Auth API endpoints for login/logout
- `src/pages/api/auth/[...auth].test.ts` - Unit tests for auth endpoints
- `src/components/editor/Editor.tsx` - Main editor component with WYSIWYG/Markdown modes
- `src/components/editor/Editor.test.tsx` - Unit tests for editor component
- `src/components/editor/Toolbar.tsx` - Editor toolbar with formatting options
- `src/components/editor/Toolbar.test.tsx` - Unit tests for toolbar
- `src/lib/github/client.ts` - GitHub API client for PR creation
- `src/lib/github/client.test.ts` - Unit tests for GitHub client
- `src/pages/api/contributions/submit.ts` - API endpoint for submitting contributions
- `src/pages/api/contributions/submit.test.ts` - Unit tests for submission endpoint
- `src/pages/dashboard.tsx` - User dashboard for viewing contributions
- `src/pages/dashboard.test.tsx` - Unit tests for dashboard
- `src/pages/admin/contributions.tsx` - Admin view for managing contributions
- `src/pages/admin/contributions.test.tsx` - Unit tests for admin view
- `src/lib/email/notifications.ts` - Email notification service
- `src/lib/email/notifications.test.ts` - Unit tests for email service
- `src/lib/db/schema.ts` - Database schema for users and contributions
- `src/lib/security/sanitizer.ts` - Input sanitization utilities
- `src/lib/security/sanitizer.test.ts` - Unit tests for sanitizer

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [ ] 1.0 Set up user authentication system with social login
  - [x] 1.1 Install and configure OAuth libraries (NextAuth.js or similar)
  - [x] 1.2 Set up Google OAuth provider with minimal scope (email, name)
  - [ ] 1.3 Set up GitHub OAuth provider with minimal scope
  - [ ] 1.4 Create user database schema (email, name, provider, role, blocked status)
  - [ ] 1.5 Implement session management with secure cookies
  - [ ] 1.6 Create login/logout API endpoints
  - [ ] 1.7 Add email verification flow for new accounts
  - [ ] 1.8 Create protected route middleware for authenticated pages
  - [ ] 1.9 Write unit tests for authentication flow

- [ ] 2.0 Create the online editor interface with WYSIWYG and Markdown modes
  - [ ] 2.1 Research and select WYSIWYG editor library (TipTap, Slate, or similar)
  - [ ] 2.2 Create base Editor component with mode toggle
  - [ ] 2.3 Configure WYSIWYG toolbar with allowed formatting options (headings, bold, italic, lists, code, quotes, links, tables)
  - [ ] 2.4 Implement Markdown mode with syntax highlighting
  - [ ] 2.5 Add real-time preview panel showing rendered output
  - [ ] 2.6 Create file selector/dropdown for choosing which styleguide to edit
  - [ ] 2.7 Implement "Create New Guide" functionality with title input
  - [ ] 2.8 Add save draft functionality (store in browser localStorage)
  - [ ] 2.9 Create responsive layout for tablet/desktop editing
  - [ ] 2.10 Write unit tests for editor component and formatting

- [ ] 3.0 Implement GitHub integration for PR creation
  - [ ] 3.1 Set up GitHub App or OAuth App for repository access
  - [ ] 3.2 Create GitHub API client using Octokit
  - [ ] 3.3 Implement branch creation with naming convention (community-contribution/[username]/[guide-name]-[timestamp])
  - [ ] 3.4 Create file commit functionality for edited/new guides
  - [ ] 3.5 Implement PR creation with formatted description and change summary
  - [ ] 3.6 Add error handling for GitHub API failures
  - [ ] 3.7 Store PR metadata in database (PR number, status, contributor)
  - [ ] 3.8 Write unit tests for GitHub integration

- [ ] 4.0 Build contribution management dashboard
  - [ ] 4.1 Create user dashboard page showing their contributions
  - [ ] 4.2 Display contribution status (pending/approved/rejected) with PR links
  - [ ] 4.3 Add "Download for personal use" functionality (generate .md file)
  - [ ] 4.4 Create admin dashboard for editors to view all contributions
  - [ ] 4.5 Implement user blocking/unblocking functionality for editors
  - [ ] 4.6 Add contribution filtering and search
  - [ ] 4.7 Display attribution information for accepted contributions
  - [ ] 4.8 Write unit tests for dashboard components

- [ ] 5.0 Add email notification system
  - [ ] 5.1 Select and configure email service (SendGrid, AWS SES, or similar)
  - [ ] 5.2 Create email templates for contribution status updates
  - [ ] 5.3 Implement webhook endpoint to receive GitHub PR status changes
  - [ ] 5.4 Add email sending logic when PR is merged or closed
  - [ ] 5.5 Create user preference for email notifications (opt-in by default)
  - [ ] 5.6 Add email queue to handle sending failures
  - [ ] 5.7 Write unit tests for email notification flow

- [ ] 6.0 Implement security and permissions
  - [ ] 6.1 Create input sanitization utilities to prevent XSS
  - [ ] 6.2 Implement role-based access control (contributor/editor)
  - [ ] 6.3 Add rate limiting for API endpoints
  - [ ] 6.4 Secure file upload/download endpoints
  - [ ] 6.5 Implement CSRF protection for form submissions
  - [ ] 6.6 Add request validation for all API endpoints
  - [ ] 6.7 Create audit log for sensitive actions (blocking users, role changes)
  - [ ] 6.8 Write security-focused unit tests