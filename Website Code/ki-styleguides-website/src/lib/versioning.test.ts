import {
  parseVersion,
  formatVersion,
  incrementSemver,
  compareVersions,
  isValidVersion,
  getLatestVersion,
  formatVersionDisplay,
  getVersionDate,
  createVersionEntry,
  addVersionToHistory,
  getVersionHistory,
  getRecentVersions,
  hasVersionInHistory,
  formatVersionChangelog,
  getVersionStats,
  VersionIncrement,
  StyleguideVersionEntry,
  VersionHistoryEntry
} from './versioning';

describe('Versioning Utilities', () => {
  describe('parseVersion', () => {
    it('should parse valid semantic versions', () => {
      expect(parseVersion('1.2.3')).toEqual({
        major: 1,
        minor: 2,
        patch: 3,
        raw: '1.2.3'
      });
      
      expect(parseVersion('0.0.1')).toEqual({
        major: 0,
        minor: 0,
        patch: 1,
        raw: '0.0.1'
      });
      
      expect(parseVersion('10.20.30')).toEqual({
        major: 10,
        minor: 20,
        patch: 30,
        raw: '10.20.30'
      });
    });
    
    it('should return null for invalid versions', () => {
      expect(parseVersion('1.2')).toBeNull();
      expect(parseVersion('1.2.3.4')).toBeNull();
      expect(parseVersion('v1.2.3')).toBeNull();
      expect(parseVersion('1.2.x')).toBeNull();
      expect(parseVersion('')).toBeNull();
    });
  });
  
  describe('formatVersion', () => {
    it('should format version components correctly', () => {
      expect(formatVersion(1, 2, 3)).toBe('1.2.3');
      expect(formatVersion(0, 0, 1)).toBe('0.0.1');
      expect(formatVersion(10, 20, 30)).toBe('10.20.30');
    });
  });
  
  describe('incrementSemver', () => {
    it('should increment patch version', () => {
      expect(incrementSemver('1.2.3', VersionIncrement.PATCH)).toBe('1.2.4');
      expect(incrementSemver('1.2.9', VersionIncrement.PATCH)).toBe('1.2.10');
      expect(incrementSemver('0.0.0', VersionIncrement.PATCH)).toBe('0.0.1');
    });
    
    it('should increment minor version and reset patch', () => {
      expect(incrementSemver('1.2.3', VersionIncrement.MINOR)).toBe('1.3.0');
      expect(incrementSemver('1.9.5', VersionIncrement.MINOR)).toBe('1.10.0');
      expect(incrementSemver('0.0.1', VersionIncrement.MINOR)).toBe('0.1.0');
    });
    
    it('should increment major version and reset minor/patch', () => {
      expect(incrementSemver('1.2.3', VersionIncrement.MAJOR)).toBe('2.0.0');
      expect(incrementSemver('9.5.2', VersionIncrement.MAJOR)).toBe('10.0.0');
      expect(incrementSemver('0.9.9', VersionIncrement.MAJOR)).toBe('1.0.0');
    });
    
    it('should throw error for invalid version', () => {
      expect(() => incrementSemver('invalid', VersionIncrement.PATCH)).toThrow();
      expect(() => incrementSemver('1.2', VersionIncrement.PATCH)).toThrow();
    });
  });
  
  describe('compareVersions', () => {
    it('should correctly compare versions', () => {
      expect(compareVersions('1.0.0', '1.0.0')).toBe(0);
      expect(compareVersions('1.0.1', '1.0.0')).toBe(1);
      expect(compareVersions('1.0.0', '1.0.1')).toBe(-1);
      
      expect(compareVersions('2.0.0', '1.9.9')).toBe(1);
      expect(compareVersions('1.9.9', '2.0.0')).toBe(-1);
      
      expect(compareVersions('1.2.0', '1.1.9')).toBe(1);
      expect(compareVersions('1.1.9', '1.2.0')).toBe(-1);
    });
    
    it('should throw error for invalid versions', () => {
      expect(() => compareVersions('1.2.3', 'invalid')).toThrow();
      expect(() => compareVersions('invalid', '1.2.3')).toThrow();
    });
  });
  
  describe('isValidVersion', () => {
    it('should validate correct semantic versions', () => {
      expect(isValidVersion('1.2.3')).toBe(true);
      expect(isValidVersion('0.0.0')).toBe(true);
      expect(isValidVersion('10.20.30')).toBe(true);
    });
    
    it('should reject invalid versions', () => {
      expect(isValidVersion('1.2')).toBe(false);
      expect(isValidVersion('1.2.3.4')).toBe(false);
      expect(isValidVersion('v1.2.3')).toBe(false);
      expect(isValidVersion('1.2.x')).toBe(false);
      expect(isValidVersion('')).toBe(false);
      expect(isValidVersion('abc')).toBe(false);
    });
  });
  
  describe('getLatestVersion', () => {
    it('should find the latest version', () => {
      expect(getLatestVersion(['1.0.0', '2.0.0', '1.5.0'])).toBe('2.0.0');
      expect(getLatestVersion(['0.0.1', '0.0.2', '0.0.3'])).toBe('0.0.3');
      expect(getLatestVersion(['1.2.3', '1.2.4', '1.2.2'])).toBe('1.2.4');
    });
    
    it('should handle single version', () => {
      expect(getLatestVersion(['1.0.0'])).toBe('1.0.0');
    });
    
    it('should return null for empty array', () => {
      expect(getLatestVersion([])).toBeNull();
    });
    
    it('should skip invalid versions', () => {
      expect(getLatestVersion(['1.0.0', 'invalid', '2.0.0'])).toBe('2.0.0');
      expect(getLatestVersion(['invalid', 'v1.2.3'])).toBeNull();
    });
  });
  
  describe('formatVersionDisplay', () => {
    it('should format version with default prefix', () => {
      expect(formatVersionDisplay('1.2.3')).toBe('v1.2.3');
      expect(formatVersionDisplay('0.0.1')).toBe('v0.0.1');
    });
    
    it('should format version with custom prefix', () => {
      expect(formatVersionDisplay('1.2.3', 'Version ')).toBe('Version 1.2.3');
      expect(formatVersionDisplay('1.2.3', '')).toBe('1.2.3');
      expect(formatVersionDisplay('1.2.3', 'r')).toBe('r1.2.3');
    });
  });
  
  describe('getVersionDate', () => {
    it('should return date in YYYY-MM-DD format', () => {
      const date = getVersionDate();
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      
      const today = new Date();
      const expectedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      expect(date).toBe(expectedDate);
    });
  });
  
  describe('createVersionEntry', () => {
    it('should create version entry with defaults', () => {
      const entry = createVersionEntry('test.md', 'Test Guide');
      
      expect(entry.filename).toBe('test.md');
      expect(entry.title).toBe('Test Guide');
      expect(entry.version).toBe('1.0.0');
      expect(entry.changeNotes).toBe('Initial version');
      expect(entry.lastUpdated).toBe(getVersionDate());
      expect(entry.contentHash).toBeNull();
      expect(entry.history).toHaveLength(1);
      expect(entry.history[0]).toEqual({
        version: '1.0.0',
        date: getVersionDate(),
        notes: 'Initial version'
      });
    });
    
    it('should create version entry with custom values', () => {
      const entry = createVersionEntry(
        'guide.md',
        'My Guide',
        '2.1.0',
        'Added new section'
      );
      
      expect(entry.filename).toBe('guide.md');
      expect(entry.title).toBe('My Guide');
      expect(entry.version).toBe('2.1.0');
      expect(entry.changeNotes).toBe('Added new section');
      expect(entry.history[0].notes).toBe('Added new section');
    });
  });

  describe('addVersionToHistory', () => {
    let sampleEntry: StyleguideVersionEntry;

    beforeEach(() => {
      sampleEntry = createVersionEntry('test.md', 'Test Guide', '1.0.0', 'Initial version');
    });

    it('should add new version to history', () => {
      const updatedEntry = addVersionToHistory(sampleEntry, '1.1.0', 'Added new features');
      
      expect(updatedEntry.version).toBe('1.1.0');
      expect(updatedEntry.changeNotes).toBe('Added new features');
      expect(updatedEntry.lastUpdated).toBe(getVersionDate());
      expect(updatedEntry.history).toHaveLength(2);
      
      const latestHistory = updatedEntry.history[1];
      expect(latestHistory.version).toBe('1.1.0');
      expect(latestHistory.notes).toBe('Added new features');
      expect(latestHistory.date).toBe(getVersionDate());
    });

    it('should preserve existing history when adding new version', () => {
      const firstUpdate = addVersionToHistory(sampleEntry, '1.1.0', 'Minor update');
      const secondUpdate = addVersionToHistory(firstUpdate, '2.0.0', 'Major update');
      
      expect(secondUpdate.history).toHaveLength(3);
      expect(secondUpdate.history[0].version).toBe('1.0.0');
      expect(secondUpdate.history[1].version).toBe('1.1.0');
      expect(secondUpdate.history[2].version).toBe('2.0.0');
    });

    it('should not mutate original entry', () => {
      const updatedEntry = addVersionToHistory(sampleEntry, '1.1.0', 'Update');
      
      expect(sampleEntry.version).toBe('1.0.0');
      expect(sampleEntry.history).toHaveLength(1);
      expect(updatedEntry.version).toBe('1.1.0');
      expect(updatedEntry.history).toHaveLength(2);
    });
  });

  describe('getVersionHistory', () => {
    it('should return history sorted by version (newest first)', () => {
      let entry = createVersionEntry('test.md', 'Test Guide', '1.0.0', 'Initial');
      entry = addVersionToHistory(entry, '1.2.0', 'Minor update');
      entry = addVersionToHistory(entry, '1.1.0', 'Patch update');
      entry = addVersionToHistory(entry, '2.0.0', 'Major update');
      
      const history = getVersionHistory(entry);
      
      expect(history).toHaveLength(4);
      expect(history[0].version).toBe('2.0.0');
      expect(history[1].version).toBe('1.2.0');
      expect(history[2].version).toBe('1.1.0');
      expect(history[3].version).toBe('1.0.0');
    });

    it('should handle empty history', () => {
      const entry: StyleguideVersionEntry = {
        filename: 'test.md',
        title: 'Test',
        version: '1.0.0',
        lastUpdated: '2025-01-09',
        changeNotes: 'Test',
        contentHash: null,
        history: []
      };
      
      const history = getVersionHistory(entry);
      expect(history).toHaveLength(0);
    });
  });

  describe('getRecentVersions', () => {
    let entryWithManyVersions: StyleguideVersionEntry;

    beforeEach(() => {
      let entry = createVersionEntry('test.md', 'Test Guide', '1.0.0', 'Initial');
      for (let i = 1; i <= 10; i++) {
        entry = addVersionToHistory(entry, `1.${i}.0`, `Update ${i}`);
      }
      entryWithManyVersions = entry;
    });

    it('should return default 5 recent versions', () => {
      const recent = getRecentVersions(entryWithManyVersions);
      
      expect(recent).toHaveLength(5);
      expect(recent[0].version).toBe('1.10.0');
      expect(recent[4].version).toBe('1.6.0');
    });

    it('should return specified number of recent versions', () => {
      const recent = getRecentVersions(entryWithManyVersions, 3);
      
      expect(recent).toHaveLength(3);
      expect(recent[0].version).toBe('1.10.0');
      expect(recent[2].version).toBe('1.8.0');
    });

    it('should return all versions if count exceeds history length', () => {
      const entry = createVersionEntry('test.md', 'Test Guide');
      const recent = getRecentVersions(entry, 10);
      
      expect(recent).toHaveLength(1);
      expect(recent[0].version).toBe('1.0.0');
    });
  });

  describe('hasVersionInHistory', () => {
    let entry: StyleguideVersionEntry;

    beforeEach(() => {
      entry = createVersionEntry('test.md', 'Test Guide', '1.0.0', 'Initial');
      entry = addVersionToHistory(entry, '1.1.0', 'Update 1');
      entry = addVersionToHistory(entry, '2.0.0', 'Update 2');
    });

    it('should return true for existing versions', () => {
      expect(hasVersionInHistory(entry, '1.0.0')).toBe(true);
      expect(hasVersionInHistory(entry, '1.1.0')).toBe(true);
      expect(hasVersionInHistory(entry, '2.0.0')).toBe(true);
    });

    it('should return false for non-existing versions', () => {
      expect(hasVersionInHistory(entry, '1.2.0')).toBe(false);
      expect(hasVersionInHistory(entry, '3.0.0')).toBe(false);
      expect(hasVersionInHistory(entry, '0.9.0')).toBe(false);
    });
  });

  describe('formatVersionChangelog', () => {
    it('should format changelog correctly', () => {
      let entry = createVersionEntry('test.md', 'Test Guide', '1.0.0', 'Initial version');
      entry = addVersionToHistory(entry, '1.1.0', 'Added new features');
      entry = addVersionToHistory(entry, '2.0.0', 'Major rewrite');
      
      const changelog = formatVersionChangelog(entry);
      
      expect(changelog).toContain('# Changelog: Test Guide');
      expect(changelog).toContain('## Version 2.0.0');
      expect(changelog).toContain('Major rewrite');
      expect(changelog).toContain('## Version 1.1.0');
      expect(changelog).toContain('Added new features');
      expect(changelog).toContain('## Version 1.0.0');
      expect(changelog).toContain('Initial version');
    });

    it('should order versions from newest to oldest in changelog', () => {
      let entry = createVersionEntry('test.md', 'Test Guide', '1.0.0', 'Initial');
      entry = addVersionToHistory(entry, '1.1.0', 'Update 1');
      entry = addVersionToHistory(entry, '2.0.0', 'Update 2');
      
      const changelog = formatVersionChangelog(entry);
      const version2Index = changelog.indexOf('## Version 2.0.0');
      const version1Index = changelog.indexOf('## Version 1.1.0');
      const version0Index = changelog.indexOf('## Version 1.0.0');
      
      expect(version2Index).toBeLessThan(version1Index);
      expect(version1Index).toBeLessThan(version0Index);
    });
  });

  describe('getVersionStats', () => {
    it('should return correct statistics', () => {
      let entry = createVersionEntry('test.md', 'Test Guide', '1.0.0', 'Initial');
      entry = addVersionToHistory(entry, '1.1.0', 'Update 1');
      entry = addVersionToHistory(entry, '2.0.0', 'Update 2');
      
      const stats = getVersionStats(entry);
      
      expect(stats.totalVersions).toBe(3);
      expect(stats.firstVersion).toBe('1.0.0');
      expect(stats.firstDate).toBe(getVersionDate());
      expect(stats.daysSinceFirst).toBe(0); // Same day
    });

    it('should handle single version correctly', () => {
      const entry = createVersionEntry('test.md', 'Test Guide');
      const stats = getVersionStats(entry);
      
      expect(stats.totalVersions).toBe(1);
      expect(stats.firstVersion).toBe('1.0.0');
      expect(stats.daysSinceFirst).toBe(0);
    });

    it('should correctly sort versions for first version detection', () => {
      let entry = createVersionEntry('test.md', 'Test Guide', '2.0.0', 'Major release');
      entry = addVersionToHistory(entry, '1.5.0', 'Earlier version'); // Added after, but earlier version
      entry = addVersionToHistory(entry, '3.0.0', 'Latest version');
      
      const stats = getVersionStats(entry);
      
      expect(stats.firstVersion).toBe('1.5.0'); // Should find the lowest version number
      expect(stats.totalVersions).toBe(3);
    });
  });
});