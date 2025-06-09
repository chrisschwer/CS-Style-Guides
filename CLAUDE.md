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
- Each guide has frontmatter with metadata (title, description, category)
- Include practical examples and clear rules that AI systems can interpret
- Test guides with actual AI tools before finalizing

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

### Collaboration
- **Styleguides/**: Content creators and AI specialists
- **Website Design/**: UX/UI designers and content strategists  
- **Website Code/**: Frontend developers and DevOps

## License and Usage

All content is licensed under CC BY 4.0, allowing free commercial and non-commercial use with attribution. The website promotes this openness and provides easy access to all materials.

## Common Tasks

### Adding a New Style Guide
1. Create new .md file in `Styleguides/`
2. Follow existing format and structure
3. Update `Styleguides/README.md` with new guide
4. Add corresponding content to `Website Design/website-content.md`
5. Test with AI tools before publishing

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
9. ✅ All 7 styleguides properly linked and accessible
10. Ready for immediate deployment to Netlify/Vercel
11. Test with `npm run build && npm run preview` before deployment

## Recent Completions (January 2025)

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
- **Navigation**: All 7 styleguides in footer and main navigation
- **Mobile Optimization**: Responsive design throughout
- **Performance**: Compact rendering with `prose-sm` and `leading-tight`

### ✅ Content Integration
- **All Styleguides**: Gutes Deutsch, Gender guides, Presentations, Charts, Datenvisualisierung, Examples
- **Proper Routing**: Each guide accessible via clean URLs
- **Download Links**: Fixed file paths to match actual filenames
- **Search Accessibility**: All content properly structured for SEO

This structure supports both independent work on different aspects and coordinated development of the complete website experience. **The website is now production-ready.**