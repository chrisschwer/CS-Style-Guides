# PRD: Styleguide Versioning Feature

## Introduction/Overview

This feature implements automatic semantic versioning for individual styleguides in the CS Style Guides project. The versioning system will track changes to styleguide content and display the current version number on the website, helping users identify whether they are using the most current version of each guide.

## Goals

1. Automatically track and increment version numbers when styleguide content changes
2. Display the current version number for each styleguide on the website
3. Provide users with confidence they are using the latest version of each guide
4. Maintain simple version notes for transparency about changes
5. Fulfill the versioning promise made in the website copy

## User Stories

1. **As a user of the styleguides**, I want to see the current version number of each guide so that I know if I'm using the latest version.

2. **As a content creator**, I want version numbers to automatically increment when I update a styleguide so that changes are tracked without manual intervention.

3. **As a regular user**, I want to quickly identify which guides have been updated since my last visit so that I can update my prompts accordingly.

4. **As an organization using these guides**, I want to track which version we've standardized on so that our team uses consistent guidelines.

## Functional Requirements

1. **Automatic Version Detection**: The system must automatically detect when the content of a styleguide markdown file has changed.

2. **Semantic Versioning**: The system must use semantic versioning (MAJOR.MINOR.PATCH) for each individual styleguide.

3. **Version Display**: The system must display the current version number for each styleguide on:
   - Individual styleguide pages
   - The styleguides overview page
   - The downloads page

4. **Initial Versioning**: All existing styleguides must be initialized to version 1.0.0.

5. **Version Metadata**: Each styleguide must store:
   - Current version number
   - Last updated date
   - Simple version notes (brief description of changes)

6. **Version Persistence**: Version information must be stored in a way that survives builds and deployments.

7. **Always Latest**: The website must always display the latest version of each styleguide (no version selection UI).

8. **Version in Downloads**: Downloaded files must include version information in:
   - File metadata/frontmatter
   - Filename (optional, e.g., `Gutes-Deutsch-v1.0.0.md`)

## Non-Goals (Out of Scope)

- Version selection UI (users always see the latest version)
- Detailed changelogs or diff views
- Package-level versioning (only individual guides are versioned)
- Version history browsing
- Rollback functionality
- API for version queries

## Design Considerations

1. **Version Display Location**: Version numbers should be displayed prominently but not intrusively:
   - Near the title on individual guide pages
   - In the metadata section of guide cards
   - As badges or tags for visual clarity

2. **Version Format**: Display as "Version 1.0.0" or "v1.0.0" consistently across the site

3. **Visual Indicators**: Consider using color coding or icons to indicate recently updated guides

## Technical Considerations

1. **Version Storage**: Version information should be stored in:
   - Frontmatter of each markdown file
   - A central version manifest file for quick access

2. **Build Integration**: Version checking should be integrated into the build process:
   - Git hooks to detect file changes
   - Build script to update versions
   - Automated version increment based on change type

3. **Change Detection**: Use file hashing or git history to detect content changes

4. **Version Increment Rules**:
   - PATCH: Minor text corrections, typo fixes
   - MINOR: Content additions, new examples, clarifications
   - MAJOR: Structural changes, new sections, breaking changes to recommendations

## Success Metrics

1. **User Awareness**: Users can immediately identify the version of each styleguide
2. **Update Tracking**: 100% of content changes result in appropriate version increments
3. **Website Promise**: The versioning feature mentioned in website copy is fully implemented
4. **Zero Manual Effort**: Version updates happen automatically without manual intervention

## Open Questions

1. Should version numbers be included in the ZIP download filenames?
2. What constitutes a MAJOR vs MINOR vs PATCH change? (Need clear guidelines)
3. Should we display "Last updated" date alongside version numbers?
4. How should version notes be managed and displayed?
5. Should there be a notification system for major version updates?