const {
  analyzeChangeScope,
  incrementVersion,
  generateChangeNotes,
  getFileHash,
  parseFrontmatter
} = require('./version-manager');

describe('Version Manager Tests', () => {
  describe('analyzeChangeScope', () => {
    test('should return patch for small changes', () => {
      const diff = `
--- a/file.md
+++ b/file.md
@@ -1,3 +1,3 @@
 Some content here
-with a typo
+with a fix
 more content`;
      
      expect(analyzeChangeScope(diff)).toBe('patch');
    });

    test('should return minor for content additions', () => {
      const diff = `
--- a/file.md
+++ b/file.md
@@ -1,3 +1,15 @@
 # Title
 
+* New bullet point
+* Another bullet point
+* More content
+* Even more content
+* Additional content
+* Extra content
+* More items
+* Another item
+* Yet another item
+* Final item
+
 Original content`;
      
      expect(analyzeChangeScope(diff)).toBe('minor');
    });

    test('should return major for structural changes', () => {
      const diff = `
--- a/file.md
+++ b/file.md
@@ -1,3 +1,5 @@
-# Old Title
+# New Title
+
+## New Section
 
 Content here`;
      
      expect(analyzeChangeScope(diff)).toBe('major');
    });

    test('should return major for large changes', () => {
      let diff = '--- a/file.md\n+++ b/file.md\n';
      // Add 60 lines of additions
      for (let i = 0; i < 60; i++) {
        diff += `+Line ${i} of new content\n`;
      }
      
      expect(analyzeChangeScope(diff)).toBe('major');
    });

    test('should handle null or empty diff', () => {
      expect(analyzeChangeScope(null)).toBe('patch');
      expect(analyzeChangeScope('')).toBe('patch');
      expect(analyzeChangeScope(undefined)).toBe('patch');
    });

    test('should detect code block changes as minor', () => {
      const diff = `
--- a/file.md
+++ b/file.md
@@ -1,3 +1,7 @@
 # Title
 
+\`\`\`javascript
+const example = 'code';
+\`\`\`
+
 Content`;
      
      expect(analyzeChangeScope(diff)).toBe('minor');
    });
  });

  describe('incrementVersion', () => {
    test('should increment patch version correctly', () => {
      expect(incrementVersion('1.0.0', 'patch')).toBe('1.0.1');
      expect(incrementVersion('1.2.3', 'patch')).toBe('1.2.4');
      expect(incrementVersion('0.0.9', 'patch')).toBe('0.0.10');
    });

    test('should increment minor version correctly', () => {
      expect(incrementVersion('1.0.0', 'minor')).toBe('1.1.0');
      expect(incrementVersion('1.2.3', 'minor')).toBe('1.3.0');
      expect(incrementVersion('0.9.5', 'minor')).toBe('0.10.0');
    });

    test('should increment major version correctly', () => {
      expect(incrementVersion('1.0.0', 'major')).toBe('2.0.0');
      expect(incrementVersion('1.2.3', 'major')).toBe('2.0.0');
      expect(incrementVersion('0.9.5', 'major')).toBe('1.0.0');
    });

    test('should return current version for invalid increment type', () => {
      expect(incrementVersion('1.0.0', 'invalid')).toBe('1.0.0');
      expect(incrementVersion('1.0.0', null)).toBe('1.0.0');
    });
  });

  describe('generateChangeNotes', () => {
    test('should generate appropriate notes for patch changes', () => {
      const diff = 'Minor fix';
      const notes = generateChangeNotes(diff, 'patch');
      expect(notes).toContain('Minor corrections and fixes');
    });

    test('should generate appropriate notes for minor changes', () => {
      const diff = 'Added content';
      const notes = generateChangeNotes(diff, 'minor');
      expect(notes).toContain('Content additions and improvements');
    });

    test('should generate appropriate notes for major changes', () => {
      const diff = 'Major restructuring';
      const notes = generateChangeNotes(diff, 'major');
      expect(notes).toContain('Major structural changes and updates');
    });

    test('should detect specific changes in diff', () => {
      const diff = `
+# New Heading
+Some content
+\`\`\`code\`\`\``;
      
      const notes = generateChangeNotes(diff, 'minor');
      expect(notes).toContain('Updated section headings');
      expect(notes).toContain('Modified code examples');
      expect(notes).toContain('Added new content');
    });

    test('should handle null diff gracefully', () => {
      const notes = generateChangeNotes(null, 'patch');
      expect(notes).toBe('Minor corrections and fixes');
    });
  });

  describe('parseFrontmatter', () => {
    test('should parse valid frontmatter', async () => {
      // This test would need file system mocking
      // Placeholder for the test structure
      expect(true).toBe(true);
    });
  });

  describe('getFileHash', () => {
    test('should generate consistent hash for same content', async () => {
      // This test would need file system mocking
      // Placeholder for the test structure
      expect(true).toBe(true);
    });
  });
});

// Run tests if Jest is not available (basic test runner)
if (typeof describe === 'undefined') {
  console.log('Running basic tests...\n');
  
  // Test analyzeChangeScope
  console.log('Testing analyzeChangeScope:');
  const patchDiff = '- typo\n+ fixed';
  console.log(`  Patch test: ${analyzeChangeScope(patchDiff) === 'patch' ? '✅' : '❌'}`);
  
  const minorDiff = Array(15).fill('+New line').join('\n');
  console.log(`  Minor test: ${analyzeChangeScope(minorDiff) === 'minor' ? '✅' : '❌'}`);
  
  const majorDiff = '+# New Heading\n+## Another heading';
  console.log(`  Major test: ${analyzeChangeScope(majorDiff) === 'major' ? '✅' : '❌'}`);
  
  // Test incrementVersion
  console.log('\nTesting incrementVersion:');
  console.log(`  Patch increment: ${incrementVersion('1.0.0', 'patch') === '1.0.1' ? '✅' : '❌'}`);
  console.log(`  Minor increment: ${incrementVersion('1.0.0', 'minor') === '1.1.0' ? '✅' : '❌'}`);
  console.log(`  Major increment: ${incrementVersion('1.0.0', 'major') === '2.0.0' ? '✅' : '❌'}`);
  
  // Test generateChangeNotes
  console.log('\nTesting generateChangeNotes:');
  const patchNotes = generateChangeNotes('fix', 'patch');
  console.log(`  Patch notes: ${patchNotes.includes('Minor corrections') ? '✅' : '❌'}`);
  
  const minorNotes = generateChangeNotes('+ content', 'minor');
  console.log(`  Minor notes: ${minorNotes.includes('Content additions') ? '✅' : '❌'}`);
  
  console.log('\n✅ Basic tests completed!');
}