# PRD: Community Contribution Editor for Style Guides

## Introduction/Overview

This feature enables non-technical community members to contribute to the style guides through an intuitive online editor. Users can create accounts, edit existing guides or create new ones using a WYSIWYG editor (with Markdown view option), and either submit their changes for review via GitHub PRs or download them for personal use. This democratizes the contribution process while maintaining quality control through editorial review.

## Goals

1. Enable non-technical users to contribute to style guides without Git/Markdown knowledge
2. Maintain quality control through editorial review via GitHub PR workflow
3. Provide attribution for community contributions
4. Allow users to create personalized versions of guides for their own use
5. Minimize data collection while ensuring account verification

## User Stories

1. **As a non-technical user**, I want to edit style guides using a visual editor so that I can contribute without learning Markdown.
2. **As a contributor**, I want to switch between WYSIWYG and Markdown views so that I can work in my preferred format.
3. **As a contributor**, I want to submit my changes with a description so that the editor understands my intentions.
4. **As a contributor**, I want to see the status of my submissions so that I know if they were accepted or rejected.
5. **As a user**, I want to download modified guides for personal use without submitting them for review.
6. **As an editor**, I want to review submissions through GitHub PRs so that I can use familiar tools for the review process.
7. **As a blocked user**, I should not be able to access the contribution features.

## Functional Requirements

1. **User Authentication**
   - The system must support social login (Google, GitHub) for account creation
   - The system must verify new accounts before allowing contributions
   - The system must collect minimal data (email, display name from social provider)
   - The system must support account blocking by editors

2. **Editor Interface**
   - The system must provide a WYSIWYG editor with toggle to Markdown view
   - The editor must support only formatting currently used in style guides:
     - Headings (H1-H6)
     - Bold and italic text
     - Bullet points and numbered lists
     - Code blocks and inline code
     - Blockquotes
     - Links
     - Tables
   - The system must show real-time preview of changes
   - The system must clearly indicate which guide is being edited

3. **Contribution Workflow**
   - The system must allow editing of any existing style guide
   - The system must allow creation of new style guides
   - The system must require a description when submitting changes
   - The system must create a GitHub PR when changes are submitted
   - The system must show submission status (pending/approved/rejected)
   - The system must attribute accepted contributions to the author
   - The system must send email notifications when submissions are reviewed

4. **Personal Use Features**
   - The system must allow downloading edited guides without submission
   - Downloads must maintain the same Markdown format as official guides
   - The system must not track personal downloads

5. **User Roles**
   - The system must support two roles: contributor (default) and editor
   - Editors can block/unblock users
   - Editors can access all review features

## Non-Goals (Out of Scope)

1. File/image upload functionality
2. Version history or revision tracking within the editor
3. Automatic deployment of approved changes
4. User metrics or analytics tracking
5. Commenting or discussion features within the editor
6. Offline editing capabilities
7. Bulk editing of multiple guides simultaneously

## Design Considerations

- The editor interface should match the existing website design (Primary blue #1e40af, accent green #059669)
- Use the same typography (Inter for UI, JetBrains Mono for code)
- Mobile-responsive design for editing on tablets (phone editing not required)
- Clear visual distinction between WYSIWYG and Markdown modes
- Prominent save/submit buttons to prevent work loss

## Technical Considerations

1. **Authentication**: Integrate with OAuth providers (Google, GitHub)
2. **Editor Library**: Consider using a library like TipTap or Slate for WYSIWYG functionality
3. **GitHub Integration**: Use GitHub API to create PRs with appropriate branch naming
4. **Data Storage**: Minimal user data storage (email, name, role, blocked status)
5. **Security**: Sanitize all user input to prevent XSS attacks
6. **Performance**: Editor should handle guides up to 50KB without lag

## Success Metrics

- Community members successfully contribute improvements to style guides
- Quality of contributions (measured qualitatively by editor during review)
- Successful integration of community feedback into official guides
- No tracking of quantitative metrics per privacy requirements

## Additional Requirements (Resolved Questions)

Based on clarification:
- No preview environment needed - users will see their changes in the editor only
- No pre-moderation for PR creation - all submissions go directly to GitHub
- Email notifications required when submissions are reviewed (accepted/rejected)
- Branch naming convention: Suggest `community-contribution/[username]/[guide-name]-[timestamp]` format
- No collaborative editing support in initial version