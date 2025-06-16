# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

## Repository Overview

This is a comprehensive project for creating and distributing professional style guides for AI-assisted writing in German. The repository is organized into three main areas, each with distinct purposes and workflows.

## Project Structure

### 📋 Styleguides/
**Purpose**: The core content - ready-to-use style guides for AI tools
**Content**: 
- `Gutes Deutsch.md` - Clear, concise German writing principles
- `Gendergerecht mit Sternchen.md` - Gender-inclusive language with asterisk notation
- `Gendergerecht ohne Sternchen.md` - Gender-inclusive language without special characters  
- `Gute Praesentation.md` - Presentation structure and argumentation
- `Gute Charts.md` - Data visualization principles
- `Datenvisualisierung.md` - Data visualization principles
- `Beispielprompts.md` - Ready-to-use prompts for Claude, ChatGPT, and Microsoft 365 Copilot
- `README.md` - Main documentation and usage instructions
- `LICENSE` - CC BY 4.0 license

### 🎨 Website Design/
**Purpose**: Complete design system and content planning for the website
**Content**:
- `design-konzept.md` - Visual identity, colors, typography, layout principles
- `wireframes.md` - Detailed wireframes for all website pages (desktop/mobile)
- `interaktionsmuster.md` - User flows, copy-buttons, download functionality
- `website-content.md` - All German website texts and copy
- `assets/` - Screenshots, mockups, icons for website development

### 💻 Website Code/
**Purpose**: Technical implementation of the website
**Structure**:
- `planning/` - Technical architecture and development plans
- `documentation/` - Developer guides and deployment instructions
- `ki-styleguides-website/` - Astro-based website (functional prototype ready)

## Working with Different Areas

### Content Updates (Styleguides/)
- All style guides are in German and follow consistent formatting
- Each guide has frontmatter with metadata (title, description, category, version)
- Include practical examples and clear rules that AI systems can interpret
- Test guides with actual AI tools before finalizing

### Versioning System
The project includes an automatic versioning system for all styleguides:

#### Version Structure
- All styleguides use semantic versioning (MAJOR.MINOR.PATCH)
- Current version: 1.0.0 for all guides (initial release)
- Version information stored in:
  - Frontmatter of each `.md` file (version, lastUpdated, changeNotes)
  - Central `versions.json` manifest in the root directory

#### Version Increment Rules
- **PATCH (1.0.0 → 1.0.1)**: Typo fixes, minor text corrections
- **MINOR (1.0.0 → 1.1.0)**: Content additions, new examples, clarifications
- **MAJOR (1.0.0 → 2.0.0)**: Structural changes, new sections, breaking changes to recommendations

#### Files and Components
- `/versions.json` - Central version manifest
- `/Website Code/ki-styleguides-website/src/lib/versioning.ts` - TypeScript interfaces and utilities
- Version badges displayed on website (individual pages, overview, downloads)
- Automatic change detection during build process (planned)

### Design Work (Website Design/)
- Design follows mobile-first, accessibility-focused principles
- Color palette: Primary blue (#1e40af), accent green (#059669)
- Typography: Inter for text, JetBrains Mono for code
- All wireframes are detailed with exact measurements and responsive behavior

### Website Development (Website Code/)
- Tech stack: Astro + Tailwind CSS for optimal performance
- Static site generation for fast loading and SEO
- Copy-to-clipboard functionality for easy AI integration
- Deployment target: Netlify/Vercel with automatic builds

## Development Commands

### For Website Development
```bash
cd "Website Code/ki-styleguides-website"

# Install dependencies (first time)
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### For Content Updates
- Edit files directly in `Styleguides/` folder
- No build process required for style guides
- Test with AI tools before committing changes

## Key Principles

### Content Creation
1. **AI-First Design**: All guides must work well when copied into AI prompts
2. **German Focus**: All style guides target German language writing
3. **Practical Examples**: Include before/after examples, not just rules
4. **Structured Format**: Consistent headings and organization across guides

### Website Development  
1. **Performance**: < 2 second load times, Lighthouse score > 90
2. **Accessibility**: WCAG AA compliance, keyboard navigation
3. **Mobile-First**: Responsive design prioritizing mobile experience
4. **User-Friendly**: One-click downloads, copy-to-clipboard functionality
5. **Authentication**: OAuth 2.0 with Google/GitHub for contributor access
6. **Server-Side Rendering**: Using Astro with Node.js adapter for auth support

### Collaboration
- **Styleguides/**: Content creators and AI specialists
- **Website Design/**: UX/UI designers and content strategists  
- **Website Code/**: Frontend developers and DevOps

## License and Usage

All content is licensed under CC BY 4.0, allowing free commercial and non-commercial use with attribution. The website promotes this openness and provides easy access to all materials.

## Common Tasks

### Adding a New Style Guide

#### Required Frontmatter
Every new styleguide file in `Styleguides/` must begin with YAML frontmatter containing version metadata:

```yaml
---
version: "1.0.0"
lastUpdated: "YYYY-MM-DD"
changeNotes: "Initial version"
---
```

**Field specifications:**
- `version`: Always start with "1.0.0" for new guides (semantic versioning)
- `lastUpdated`: Use format "YYYY-MM-DD" (e.g., "2025-06-11")
- `changeNotes`: Brief description of changes (e.g., "Initial version", "Added examples for formal letters")

#### Complete Process
1. Create new .md file in `Styleguides/` with descriptive German name (e.g., `Gute Protokolle.md`)
2. Add the required frontmatter at the very beginning of the file
3. Add a main heading and introduction paragraph explaining the guide's purpose
4. Structure content with clear sections and subsections using markdown headers
5. Include practical examples and clear rules that AI systems can interpret
6. Follow the formatting patterns from existing guides (bullet points, numbered lists, examples)
7. Update `Styleguides/README.md` to include the new guide in the overview
8. Add entry to `/versions.json` manifest following the existing structure
9. Add corresponding content to `Website Design/website-content.md` for website integration
10. Test the guide with actual AI tools (Claude, ChatGPT, etc.) before finalizing
11. Run versioning commands to register the new file (see Automatic Versioning System section)

### When User Adds New Styleguide: Complete Integration Checklist

If a user reports they have added a new styleguide to `Styleguides/`, perform these steps to ensure full website integration:

#### Step 1: Verify File Structure
```bash
# Check that the new file exists with proper frontmatter
ls -la Styleguides/
# Verify the file has required frontmatter (version, lastUpdated, changeNotes)
```

#### Step 2: Add to Version Manifest
1. **Add entry to `/versions.json`** following the existing pattern:
   ```json
   "new-styleguide-slug": {
     "filename": "New Styleguide.md",
     "version": "1.0.0", 
     "lastUpdated": "YYYY-MM-DD",
     "changeNotes": "Initial version",
     "title": "New Styleguide Title",
     "contentHash": "",
     "history": [...]
   }
   ```

#### Step 3: Update Styleguides Documentation
1. **Update `Styleguides/README.md`** - Add new guide to the appropriate section
2. **Update main project `README.md`** - Update styleguide count and add to list

#### Step 4: Website Integration (Critical)
1. **Add to styleguide mapping** in `/src/pages/styleguides/[...slug].astro`:
   ```javascript
   'new-slug': {
     file: 'New Styleguide.md',
     title: 'New Styleguide Title', 
     description: 'Brief description...',
     icon: '📋',
     difficulty: 'Einfach',
     tags: ['Tag1', 'Tag2']
   }
   ```

2. **Add to getStaticPaths** in same file:
   ```javascript
   { params: { slug: 'new-slug' } }
   ```

3. **Add to version slug mapping** in same file:
   ```javascript
   'new-slug': 'new-styleguide-slug'
   ```

4. **Add StyleguideCard to main overview** in `/src/pages/styleguides/index.astro`

5. **Add StyleguideCard to homepage** in `/src/pages/index.astro` 

6. **Add to Footer navigation** in `/src/components/Footer.astro`

7. **Update Downloads page** in `/src/pages/downloads.astro`:
   - Change count from "7" to "8" (or appropriate number)
   - Add file to package contents list
   - Add filename to JavaScript files array for ZIP download

#### Step 5: Run Versioning Commands
```bash
cd "Website Code/ki-styleguides-website"
npm run version:update-hashes  # Generate content hash
npm run files:sync            # Sync to public directory  
npm run version:check         # Verify recognition
```

#### Step 6: Test Integration
```bash
npm run build                 # Full build test
# Verify all pages build successfully
# Check that new styleguide appears in build output
```

#### Step 7: Verify All Integrations
- ✅ Individual detail page builds at `/styleguides/new-slug/`
- ✅ Appears in main styleguides overview page
- ✅ Shows on homepage styleguide grid
- ✅ Listed in footer navigation
- ✅ Included in ZIP download (count updated)
- ✅ Version tracking works properly
- ✅ File synced to `/public/files/`

**Common Issues:**
- Missing from ZIP download → Check hardcoded files array in downloads.astro
- 404 on detail page → Check slug mapping and getStaticPaths
- Not showing on homepage → Check StyleguideCard addition
- Version errors → Check versions.json entry and run update-hashes

### Updating Website Design
1. Modify files in `Website Design/` 
2. Ensure wireframes match content changes
3. Update `website-content.md` if copy changes
4. Coordinate with development team for implementation

### Website Deployment
1. Work in `Website Code/ki-styleguides-website/`
2. Styleguides are automatically copied to `public/files/` for downloads
3. **Current status: FULLY COMPLETE AND DEPLOYMENT-READY**
4. ✅ All individual styleguide detail pages implemented with dynamic routing
5. ✅ ZIP download functionality with proper file packaging
6. ✅ Legal pages (Impressum, Datenschutz, Lizenz) completed
7. ✅ Copy-to-clipboard functionality for all content
8. ✅ Responsive design and compact markdown rendering
9. ✅ All 8 styleguides properly linked and accessible
10. Ready for immediate deployment to Netlify/Vercel
11. Test with `npm run build && npm run preview` before deployment

## Recent Completions (June 2025)

### ✅ Core Website Features
- **Dynamic Styleguide Pages**: `/styleguides/[slug]/` routing implemented
- **ZIP Download**: Proper ZIP generation with JSZip for complete package
- **Content Rendering**: Compact, readable markdown formatting with copy buttons
- **Missing Pages**: Created `/anwendung/` tutorial page

### ✅ Legal Compliance  
- **Impressum**: Complete contact details (Christoph Schwerdtfeger, Lehenstraße 19, 70180 Stuttgart)
- **Datenschutz**: GDPR-compliant privacy policy emphasizing no data collection
- **Lizenz**: Detailed CC BY 4.0 information with attribution examples

### ✅ User Experience
- **Copy Functionality**: Entire guides and individual sections
- **Navigation**: All 8 styleguides in footer and main navigation
- **Mobile Optimization**: Responsive design throughout
- **Performance**: Compact rendering with `prose-sm` and `leading-tight`

### ✅ Content Integration
- **All Styleguides**: Gutes Deutsch, Gender guides, Presentations, Charts, Datenvisualisierung, Examples
- **Proper Routing**: Each guide accessible via clean URLs
- **Download Links**: Fixed file paths to match actual filenames
- **Search Accessibility**: All content properly structured for SEO

### ✅ Automatic Versioning System (June 2025)
- **Semantic Versioning**: MAJOR.MINOR.PATCH version numbering for all styleguides
- **Git-Based Change Detection**: Automatically detects changes using git diff analysis
- **Content Hashing**: SHA-256 hashes for version validation and fallback change detection
- **Build Integration**: Version checks run during prebuild, build, and postbuild phases
- **Smart Version Increments**: Analyzes change scope to determine appropriate version bump
- **Version Display**: Shows versions on all pages, downloads, and in ZIP packages
- **Comprehensive Manifest**: Central versions.json file tracks all guide versions and history

## Automatic Versioning System

The project includes a comprehensive automatic versioning system that tracks changes to styleguides and manages version numbers following semantic versioning principles.

### How It Works

1. **Change Detection**: The system uses git diff to detect changes in styleguide files
2. **Smart Analysis**: Changes are analyzed to determine version increment type:
   - **MAJOR**: Structural changes (headings, major sections)
   - **MINOR**: Content additions (bullet points, new sections, code blocks)
   - **PATCH**: Minor corrections and fixes
3. **Automatic Updates**: Version numbers and metadata are updated in both file frontmatter and central manifest
4. **Build Integration**: Version checks run automatically during the build process

### Key Components

- **`scripts/version-manager.cjs`**: Core versioning logic and CLI commands
- **`scripts/sync-files.cjs`**: Synchronizes source files with public download files
- **`src/integrations/version-manager.ts`**: Astro integration for build-time version management
- **`versions.json`**: Central manifest tracking all styleguide versions and history
- **Version frontmatter**: Each styleguide contains version metadata in YAML frontmatter

### Editing Workflow

**IMPORTANT**: Always edit styleguides in the `Styleguides/` directory only!

```bash
# 1. Edit a styleguide file in the main directory
# Example: Edit "Styleguides/Gutes Deutsch.md"

# 2. Navigate to website directory  
cd "Website Code/ki-styleguides-website"

# 3. Check what changed
npm run version:check

# 4. Update versions automatically
npm run version:update

# 5. Build (automatically syncs all files)
npm run build
```

**File Synchronization:**
- Source files: `Styleguides/*.md` (EDIT THESE)
- Public files: `Website Code/ki-styleguides-website/public/files/` (AUTO-GENERATED)
- The versioning system only detects changes in source files
- Public files are automatically synchronized during build

### Available Commands

```bash
# Check for changes
npm run version:check

# Update content hashes  
npm run version:update-hashes

# Apply version updates for detected changes
npm run version:update

# Manually bump a specific file
npm run version:bump <filename> <patch|minor|major> [notes]

# View version history
npm run version:history [filename]

# Sync files between source and public directories
npm run files:sync

# Generate versioned ZIP package
npm run version:generate-zip
```

### Build Process Integration

The versioning system is fully integrated into the build process:

1. **Prebuild**: Checks for changes, updates hashes, syncs files
2. **Build**: Astro integration runs version checks during build start and completion
3. **Postbuild**: Validates all versions and provides build statistics

### Deployment Integration (Vercel/Netlify)

✅ **Works automatically!** The build process is fully integrated:

**Deployment Workflow:**
```bash
# 1. Edit styleguide locally
# Example: Edit "Styleguides/Gutes Deutsch.md"

# 2. Update versioning locally (recommended)
cd "Website Code/ki-styleguides-website"
npm run version:update

# 3. Commit and push to Git
git add .
git commit -m "Update Gutes Deutsch styleguide" 
git push

# 4. Vercel/Netlify automatically:
# - Runs npm run prebuild (file sync)
# - Runs npm run build (with Astro integration)
# - Runs npm run postbuild (validation)
```

**Two Options:**
- **Option A (Recommended)**: Update versions locally before pushing
- **Option B**: Only edit styleguides, deployment syncs automatically (but without version updates)

**Important**: For proper version tracking, run `npm run version:update` locally before pushing changes to ensure version numbers are incremented correctly.

### Version Display

- **Individual Pages**: Version badges displayed on each styleguide page
- **Download Page**: Version information for each guide with visual indicators for recent updates
- **ZIP Downloads**: Include version manifest, changelog, and version-aware filenames
- **Homepage**: Recently updated guides section highlights version changes

## Recent Updates (June 2025)

### ✅ File Naming Standardization
- **Renamed Files**: Standardized naming to remove author references
  - `Wolf Schneider.md` → `Gutes Deutsch.md`
  - `Gene Zelazny Charts.md` → `Gute Charts.md` 
  - `Datenvisualisierung nach Tufte.md` → `Datenvisualisierung.md`
- **Updated References**: All website content, navigation, and downloads reflect new names
- **Maintained Compatibility**: URL slugs preserved for backwards compatibility

### ✅ GitHub Repository Updates
- **New Repository**: Updated all links to https://github.com/chrisschwer/CS-Style-Guides
- **Profile Update**: Changed GitHub profile references to github.com/chrisschwer
- **Consistent Links**: All issues, discussions, and repository links updated

### ✅ Content Synchronization
- **Website-Content Alignment**: Design documentation synchronized with actual website
- **File Count Correction**: Updated from 6 to 8 styleguides in download descriptions
- **Author Section Removal**: Removed "Über den Autor" section from about page

### ✅ Date Corrections and German Formatting (June 2025)
- **Date Standardization**: Corrected all styleguide dates from "2025-01-09" to "2025-06-09" (actual creation date)
- **German Date Format**: Implemented `formatDateGerman()` function for dd.mm.yyyy display format throughout website
- **Automatic Version Updates**: Version system automatically incremented all guides to v1.0.1 due to metadata changes
- **Build Process Integration**: German date formatting works in ZIP downloads, version badges, and all display components
- **Template Scope Fixes**: Resolved TypeScript compilation issues in inline scripts for downloads page

### ✅ Community Acknowledgement System (June 2025) - FULLY IMPLEMENTED
- **GitHub API Integration**: Complete REST API client with contributor fetching, first commit tracking, error handling, and retry logic
- **24-Hour Caching System**: File-based cache reduces API calls, validates expiration, and handles cleanup automatically
- **Multi-Source Opt-Out**: File-based (.contributors-exclusions), GitHub issues, and repository file scanning with GDPR compliance
- **Production-Ready Component**: ContributorsList.astro fully integrated in /ueber/ page with responsive grid (2-6 columns)
- **Accessibility Compliant**: WCAG 2.1 AA standards with screen reader support, keyboard navigation, and reduced motion
- **Performance Optimized**: Lazy loading, GitHub CDN, layout stability, Core Web Vitals optimized (LCP/FID/CLS)
- **Enterprise Reliability**: Graceful degradation, fallback data, comprehensive error handling, zero build failures
- **Comprehensive Testing**: 100% test coverage including responsive design, API failures, caching, and performance scenarios

## Memories

- When prompted to create a PRD for a new feature, use @ai-dev-tasks/create-prd.mdc
- When prompted to create a task list from a PRD, look/ask for a PRD file and use @ai-dev-tasks/generate-tasks.mdc
- When asked to work on a set of tasks from a file, use @ai-dev-task/process-task-list.mdc

This structure supports both independent work on different aspects and coordinated development of the complete website experience. **The website is now production-ready.**

## Community Contribution Editor (In Progress)

### Overview
A new feature is being developed to enable community contributions through an online editor. This will allow non-technical users to contribute to the style guides without Git/Markdown knowledge.

### Current Status (December 2025)
- ✅ **Authentication Foundation**: OAuth 2.0 integration with auth-astro (complete but temporarily disabled)
- ✅ **Google OAuth Provider**: Configured with minimal scopes (email, profile)
- ✅ **GitHub OAuth Provider**: Configured with minimal scopes (read:user, user:email)
- ⚠️ **Deployment Issue**: Auth disabled due to Vercel SSR runtime compatibility issues
- 🚧 **Database Schema**: User management system pending
- 🚧 **Editor Interface**: WYSIWYG/Markdown editor pending
- 🚧 **GitHub Integration**: PR creation workflow pending

### Technical Stack
- **Authentication**: auth-astro (Auth.js for Astro)
- **OAuth Providers**: Google (configured), GitHub (configured)
- **Server**: Astro with Node.js adapter for SSR
- **Environment**: Requires AUTH_SECRET and OAuth credentials

### Development Setup
1. Copy `.env.example` to `.env`
2. Generate AUTH_SECRET: `openssl rand -base64 32`
3. Configure OAuth providers (see `docs/oauth-setup.md`)
4. Run `npm install` to install dependencies
5. Run `npm run dev` to start development server

**Note**: Authentication is currently disabled in production due to Vercel deployment issues.

### Architecture Changes
- Authentication foundation ready but temporarily disabled for deployment
- Deployment currently uses **static generation** for Vercel compatibility
- SSR capabilities ready when deploying to auth-compatible platforms
- Session management with secure cookies (configured but inactive)
- Modular provider configuration in `src/lib/auth/` (ready for activation)

### Deployment Status
- **Current**: Static deployment on Vercel (all core features working)
- **Auth Features**: Complete but commented out due to runtime compatibility issues
- **Alternative**: Could deploy to Netlify/Railway for full SSR + auth support