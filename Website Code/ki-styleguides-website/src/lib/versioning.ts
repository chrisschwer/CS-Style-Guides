/**
 * Version metadata interfaces for the CS Style Guides versioning system
 */

/**
 * Represents version information for a single styleguide
 */
export interface StyleguideVersion {
  /** Semantic version string (e.g., "1.0.0") */
  version: string;
  
  /** ISO date string of last update (e.g., "2025-01-09") */
  lastUpdated: string;
  
  /** Brief description of changes in this version */
  changeNotes: string;
}

/**
 * Extended version information including file metadata
 */
export interface StyleguideVersionEntry extends StyleguideVersion {
  /** Original filename in the Styleguides directory */
  filename: string;
  
  /** Human-readable title of the styleguide */
  title: string;
  
  /** SHA-256 hash of the file content for change detection */
  contentHash: string | null;
  
  /** Version history for this styleguide */
  history: VersionHistoryEntry[];
}

/**
 * Version manifest structure
 */
export interface VersionManifest {
  /** Map of styleguide slugs to their version information */
  styleguides: Record<string, StyleguideVersionEntry>;
  
  /** Schema information for the manifest itself */
  schema: {
    version: string;
    description: string;
  };
}

/**
 * Version increment types following semantic versioning
 */
export enum VersionIncrement {
  /** Patch version: bug fixes, typo corrections */
  PATCH = 'patch',
  
  /** Minor version: new features, content additions */
  MINOR = 'minor',
  
  /** Major version: breaking changes, structural updates */
  MAJOR = 'major'
}

/**
 * Change detection result
 */
export interface ChangeDetectionResult {
  /** Whether the file has changed */
  hasChanged: boolean;
  
  /** Suggested version increment type */
  incrementType?: VersionIncrement;
  
  /** Summary of detected changes */
  changeSummary?: string;
}

/**
 * Version history entry
 */
export interface VersionHistoryEntry {
  /** Version number */
  version: string;
  
  /** Date of release */
  date: string;
  
  /** Change notes */
  notes: string;
}

/**
 * Parsed semantic version components
 */
export interface SemanticVersion {
  major: number;
  minor: number;
  patch: number;
  raw: string;
}

/**
 * Parse a semantic version string into components
 */
export function parseVersion(version: string): SemanticVersion | null {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    return null;
  }
  
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    raw: version
  };
}

/**
 * Format semantic version components into a string
 */
export function formatVersion(major: number, minor: number, patch: number): string {
  return `${major}.${minor}.${patch}`;
}

/**
 * Increment a semantic version based on increment type
 */
export function incrementSemver(version: string, incrementType: VersionIncrement): string {
  const parsed = parseVersion(version);
  if (!parsed) {
    throw new Error(`Invalid semantic version: ${version}`);
  }
  
  switch (incrementType) {
    case VersionIncrement.MAJOR:
      return formatVersion(parsed.major + 1, 0, 0);
    case VersionIncrement.MINOR:
      return formatVersion(parsed.major, parsed.minor + 1, 0);
    case VersionIncrement.PATCH:
      return formatVersion(parsed.major, parsed.minor, parsed.patch + 1);
    default:
      return version;
  }
}

/**
 * Compare two semantic versions
 * Returns: -1 if a < b, 0 if a === b, 1 if a > b
 */
export function compareVersions(a: string, b: string): number {
  const versionA = parseVersion(a);
  const versionB = parseVersion(b);
  
  if (!versionA || !versionB) {
    throw new Error('Invalid version format');
  }
  
  if (versionA.major !== versionB.major) {
    return versionA.major > versionB.major ? 1 : -1;
  }
  
  if (versionA.minor !== versionB.minor) {
    return versionA.minor > versionB.minor ? 1 : -1;
  }
  
  if (versionA.patch !== versionB.patch) {
    return versionA.patch > versionB.patch ? 1 : -1;
  }
  
  return 0;
}

/**
 * Check if a version is valid semantic version
 */
export function isValidVersion(version: string): boolean {
  return /^\d+\.\d+\.\d+$/.test(version);
}

/**
 * Get the latest version from an array of versions
 */
export function getLatestVersion(versions: string[]): string | null {
  if (versions.length === 0) {
    return null;
  }
  
  const validVersions = versions.filter(isValidVersion);
  if (validVersions.length === 0) {
    return null;
  }
  
  return validVersions.reduce((latest, current) => {
    return compareVersions(current, latest) > 0 ? current : latest;
  });
}

/**
 * Format version for display with optional prefix
 */
export function formatVersionDisplay(version: string, prefix: string = 'v'): string {
  return `${prefix}${version}`;
}

/**
 * Get formatted date for version updates
 */
export function getVersionDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format date in German format (dd.mm.yyyy)
 */
export function formatDateGerman(dateString: string): string {
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  } catch {
    return dateString; // fallback to original string if parsing fails
  }
}

/**
 * Create a version entry for the manifest
 */
export function createVersionEntry(
  filename: string,
  title: string,
  version: string = '1.0.0',
  changeNotes: string = 'Initial version'
): StyleguideVersionEntry {
  const date = getVersionDate();
  return {
    filename,
    title,
    version,
    lastUpdated: date,
    changeNotes,
    contentHash: null,
    history: [
      {
        version,
        date,
        notes: changeNotes
      }
    ]
  };
}

/**
 * Add a new version to the history
 */
export function addVersionToHistory(
  entry: StyleguideVersionEntry,
  newVersion: string,
  changeNotes: string
): StyleguideVersionEntry {
  const date = getVersionDate();
  
  // Add new version to history
  const newHistoryEntry: VersionHistoryEntry = {
    version: newVersion,
    date,
    notes: changeNotes
  };
  
  const updatedHistory = [...entry.history, newHistoryEntry];
  
  // Update the main entry
  return {
    ...entry,
    version: newVersion,
    lastUpdated: date,
    changeNotes,
    history: updatedHistory
  };
}

/**
 * Get the complete version history for a styleguide
 */
export function getVersionHistory(entry: StyleguideVersionEntry): VersionHistoryEntry[] {
  return entry.history.sort((a, b) => compareVersions(b.version, a.version));
}

/**
 * Get the latest N versions from history
 */
export function getRecentVersions(entry: StyleguideVersionEntry, count: number = 5): VersionHistoryEntry[] {
  const sortedHistory = getVersionHistory(entry);
  return sortedHistory.slice(0, count);
}

/**
 * Check if a version exists in history
 */
export function hasVersionInHistory(entry: StyleguideVersionEntry, version: string): boolean {
  return entry.history.some(historyEntry => historyEntry.version === version);
}

/**
 * Get version history as formatted changelog
 */
export function formatVersionChangelog(entry: StyleguideVersionEntry): string {
  const history = getVersionHistory(entry);
  let changelog = `# Changelog: ${entry.title}\n\n`;
  
  for (const historyEntry of history) {
    changelog += `## Version ${historyEntry.version} (${historyEntry.date})\n`;
    changelog += `${historyEntry.notes}\n\n`;
  }
  
  return changelog;
}

/**
 * Get version statistics
 */
export function getVersionStats(entry: StyleguideVersionEntry): {
  totalVersions: number;
  firstVersion: string;
  firstDate: string;
  daysSinceFirst: number;
} {
  const history = entry.history.sort((a, b) => compareVersions(a.version, b.version));
  const first = history[0];
  const firstDate = new Date(first.date);
  const now = new Date();
  const daysSinceFirst = Math.floor((now.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    totalVersions: history.length,
    firstVersion: first.version,
    firstDate: first.date,
    daysSinceFirst
  };
}

/**
 * Load version manifest from file system (server-side only)
 */
export async function loadVersionManifest(): Promise<VersionManifest | null> {
  try {
    // This will work in Node.js environment (Astro build/dev)
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const manifestPath = path.resolve('./public/versions.json');
    const content = await fs.readFile(manifestPath, 'utf-8');
    return JSON.parse(content) as VersionManifest;
  } catch (error) {
    console.error('Failed to load version manifest:', error);
    return null;
  }
}

/**
 * Get version info for a specific styleguide by filename or slug
 */
export async function getStyleguideVersion(identifier: string): Promise<StyleguideVersionEntry | null> {
  const manifest = await loadVersionManifest();
  if (!manifest) return null;
  
  // Try by slug first
  let entry = manifest.styleguides[identifier];
  if (entry) return entry;
  
  // Try by filename
  for (const [slug, styleguide] of Object.entries(manifest.styleguides)) {
    if (styleguide.filename === identifier) {
      return styleguide;
    }
  }
  
  return null;
}

/**
 * Generate slug from filename (matches version-manager.js logic)
 */
export function generateSlugFromFilename(filename: string): string {
  return filename.toLowerCase()
    .replace('.md', '')
    .replace(/\s+/g, '-')
    .replace(/[äöü]/g, match => ({ 'ä': 'ae', 'ö': 'oe', 'ü': 'ue' }[match] || match));
}

/**
 * Check if a styleguide was recently updated
 */
export function isRecentlyUpdated(lastUpdated: string, dayThreshold: number = 30): boolean {
  try {
    const updateDate = new Date(lastUpdated);
    const now = new Date();
    const daysSinceUpdate = Math.floor((now.getTime() - updateDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceUpdate <= dayThreshold;
  } catch {
    return false;
  }
}

/**
 * Get update recency level
 */
export function getUpdateRecency(lastUpdated: string): 'new' | 'recent' | 'older' {
  try {
    const updateDate = new Date(lastUpdated);
    const now = new Date();
    const daysSinceUpdate = Math.floor((now.getTime() - updateDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceUpdate <= 7) return 'new';
    if (daysSinceUpdate <= 30) return 'recent';
    return 'older';
  } catch {
    return 'older';
  }
}

/**
 * Check if a version is a major update (version x.0.0)
 */
export function isMajorUpdate(version: string): boolean {
  const parsed = parseVersion(version);
  return parsed ? (parsed.minor === 0 && parsed.patch === 0) : false;
}