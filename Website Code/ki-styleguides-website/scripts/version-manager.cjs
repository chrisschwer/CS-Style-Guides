#!/usr/bin/env node

/**
 * Version Manager Script
 * Detects changes in styleguide files and manages version updates
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

// Configuration
const CONFIG = {
  styleguideDir: path.join(__dirname, '../../../Styleguides'),
  versionsFile: path.join(__dirname, '../../../versions.json'),
  ignoredFiles: ['README.md', 'LICENSE'],
  gitEnabled: true
};

/**
 * Get the list of styleguide files
 */
async function getStyleguideFiles() {
  try {
    const files = await fs.readdir(CONFIG.styleguideDir);
    return files.filter(file => 
      file.endsWith('.md') && 
      !CONFIG.ignoredFiles.includes(file)
    );
  } catch (error) {
    console.error('Error reading styleguide directory:', error);
    return [];
  }
}

/**
 * Read and parse the versions.json file
 */
async function readVersionManifest() {
  try {
    const content = await fs.readFile(CONFIG.versionsFile, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading versions.json:', error);
    return null;
  }
}

/**
 * Write the versions manifest back to file
 */
async function writeVersionManifest(manifest) {
  try {
    const content = JSON.stringify(manifest, null, 2);
    await fs.writeFile(CONFIG.versionsFile, content, 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing versions.json:', error);
    return false;
  }
}

/**
 * Get git diff for a specific file
 */
function getGitDiff(filePath) {
  try {
    // Check if file is tracked in git
    execSync(`git ls-files --error-unmatch "${filePath}"`, { stdio: 'pipe' });
    
    // Get the diff
    const diff = execSync(`git diff HEAD -- "${filePath}"`, { encoding: 'utf8' });
    return diff;
  } catch (error) {
    // File might be untracked or git might not be available
    return null;
  }
}

/**
 * Calculate hash of file content
 */
async function getFileHash(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const hash = crypto.createHash('sha256');
    hash.update(content);
    return hash.digest('hex');
  } catch (error) {
    console.error(`Error hashing file ${filePath}:`, error);
    return null;
  }
}

/**
 * Parse frontmatter from markdown file
 */
async function parseFrontmatter(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    
    if (!frontmatterMatch) {
      return null;
    }
    
    const frontmatter = {};
    const lines = frontmatterMatch[1].split('\n');
    
    for (const line of lines) {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        const value = valueParts.join(':').trim();
        frontmatter[key.trim()] = value.replace(/^["']|["']$/g, '');
      }
    }
    
    return frontmatter;
  } catch (error) {
    console.error(`Error parsing frontmatter for ${filePath}:`, error);
    return null;
  }
}

/**
 * Update frontmatter in markdown file
 */
async function updateFrontmatter(filePath, updates) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    
    if (!frontmatterMatch) {
      console.error(`No frontmatter found in ${filePath}`);
      return false;
    }
    
    // Parse existing frontmatter
    const existingFrontmatter = await parseFrontmatter(filePath);
    const updatedFrontmatter = { ...existingFrontmatter, ...updates };
    
    // Build new frontmatter string
    let newFrontmatter = '---\n';
    for (const [key, value] of Object.entries(updatedFrontmatter)) {
      newFrontmatter += `${key}: "${value}"\n`;
    }
    newFrontmatter += '---';
    
    // Replace in content
    const newContent = content.replace(/^---\n[\s\S]*?\n---/, newFrontmatter);
    await fs.writeFile(filePath, newContent, 'utf8');
    
    return true;
  } catch (error) {
    console.error(`Error updating frontmatter for ${filePath}:`, error);
    return false;
  }
}

/**
 * Analyze diff to determine version increment type
 */
function analyzeChangeScope(diff) {
  if (!diff || typeof diff !== 'string') {
    return 'patch';
  }
  
  const lines = diff.split('\n');
  let addedLines = 0;
  let removedLines = 0;
  let structuralChanges = false;
  
  // Keywords that indicate major changes
  const majorKeywords = [
    /^[+-]\s*#{1,3}\s/, // Heading changes (# ## ###)
    /^[+-]\s*\*\*.*\*\*/, // Bold section headers
    /^[+-]\s*###\s*/, // Third-level headings
  ];
  
  // Keywords that indicate minor changes
  const minorKeywords = [
    /^[+-]\s*\*\s/, // Bullet points
    /^[+-]\s*\d+\.\s/, // Numbered lists
    /^[+-]\s*-\s/, // Dash lists
    /^[+-]\s*>\s/, // Blockquotes
    /^[+-]\s*```/, // Code blocks
  ];
  
  for (const line of lines) {
    if (line.startsWith('+') && !line.startsWith('+++')) {
      addedLines++;
      
      // Check for major structural changes
      if (majorKeywords.some(regex => regex.test(line))) {
        structuralChanges = true;
      }
    } else if (line.startsWith('-') && !line.startsWith('---')) {
      removedLines++;
      
      // Check for major structural changes
      if (majorKeywords.some(regex => regex.test(line))) {
        structuralChanges = true;
      }
    }
  }
  
  // Determine increment type based on analysis
  if (structuralChanges || addedLines > 50 || removedLines > 50) {
    return 'major';
  } else if (addedLines > 10 || removedLines > 10 || 
             lines.some(line => minorKeywords.some(regex => regex.test(line)))) {
    return 'minor';
  } else {
    return 'patch';
  }
}

/**
 * Increment semantic version
 */
function incrementVersion(currentVersion, incrementType) {
  const [major, minor, patch] = currentVersion.split('.').map(Number);
  
  switch (incrementType) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      return currentVersion;
  }
}

/**
 * Generate change notes based on diff analysis
 */
function generateChangeNotes(diff, incrementType) {
  const notes = {
    major: 'Major structural changes and updates',
    minor: 'Content additions and improvements',
    patch: 'Minor corrections and fixes'
  };
  
  let specificChanges = [];
  
  if (diff && typeof diff === 'string') {
    const lines = diff.split('\n');
    
    // Look for specific types of changes
    if (lines.some(line => line.includes('# ') || line.includes('## '))) {
      specificChanges.push('Updated section headings');
    }
    if (lines.some(line => line.includes('```'))) {
      specificChanges.push('Modified code examples');
    }
    if (lines.filter(line => line.startsWith('+')).length > lines.filter(line => line.startsWith('-')).length) {
      specificChanges.push('Added new content');
    }
  }
  
  const baseNote = notes[incrementType] || notes.patch;
  return specificChanges.length > 0 
    ? `${baseNote}: ${specificChanges.join(', ')}`
    : baseNote;
}

/**
 * Detect changes in a styleguide file
 */
async function detectChanges(filename, manifest) {
  const filePath = path.join(CONFIG.styleguideDir, filename);
  const slug = filename.toLowerCase()
    .replace('.md', '')
    .replace(/\s+/g, '-')
    .replace(/[äöü]/g, match => ({ 'ä': 'ae', 'ö': 'oe', 'ü': 'ue' }[match] || match));
  
  const entry = manifest.styleguides[slug];
  if (!entry) {
    console.log(`No manifest entry found for ${filename}`);
    return null;
  }
  
  // Try git diff first
  if (CONFIG.gitEnabled) {
    const diff = getGitDiff(filePath);
    if (diff && diff.trim().length > 0) {
      const incrementType = analyzeChangeScope(diff);
      return {
        hasChanged: true,
        filename,
        slug,
        diff,
        incrementType,
        suggestedVersion: incrementVersion(entry.version, incrementType),
        changeNotes: generateChangeNotes(diff, incrementType)
      };
    }
  }
  
  // Fall back to hash comparison
  const currentHash = await getFileHash(filePath);
  const storedHash = entry.contentHash;
  
  if (storedHash && currentHash !== storedHash) {
    return {
      hasChanged: true,
      filename,
      slug,
      hashChanged: true
    };
  }
  
  return {
    hasChanged: false,
    filename,
    slug
  };
}

/**
 * Initialize or update content hashes for all styleguides
 */
async function updateContentHashes() {
  console.log('🔧 Updating content hashes...\n');
  
  const manifest = await readVersionManifest();
  if (!manifest) {
    console.error('❌ Could not read versions.json');
    return false;
  }
  
  const files = await getStyleguideFiles();
  let updated = false;
  
  for (const file of files) {
    const filePath = path.join(CONFIG.styleguideDir, file);
    const slug = file.toLowerCase()
      .replace('.md', '')
      .replace(/\s+/g, '-')
      .replace(/[äöü]/g, match => ({ 'ä': 'ae', 'ö': 'oe', 'ü': 'ue' }[match] || match));
    
    const entry = manifest.styleguides[slug];
    if (!entry) {
      console.log(`⚠️  No manifest entry found for ${file}`);
      continue;
    }
    
    const hash = await getFileHash(filePath);
    if (hash && entry.contentHash !== hash) {
      entry.contentHash = hash;
      updated = true;
      console.log(`  ✅ Updated hash for ${file}`);
    }
  }
  
  if (updated) {
    await writeVersionManifest(manifest);
    console.log('\n✅ Content hashes updated successfully.');
  } else {
    console.log('✅ All content hashes are up to date.');
  }
  
  return updated;
}

/**
 * Update version for a specific styleguide
 */
async function updateStyleguideVersion(filename, incrementType, changeNotes, manifest) {
  const filePath = path.join(CONFIG.styleguideDir, filename);
  const slug = filename.toLowerCase()
    .replace('.md', '')
    .replace(/\s+/g, '-')
    .replace(/[äöü]/g, match => ({ 'ä': 'ae', 'ö': 'oe', 'ü': 'ue' }[match] || match));
  
  const entry = manifest.styleguides[slug];
  if (!entry) {
    console.error(`No manifest entry found for ${filename}`);
    return false;
  }
  
  const currentVersion = entry.version;
  const newVersion = incrementVersion(currentVersion, incrementType);
  const newDate = getCurrentDate();
  
  // Update frontmatter in the markdown file
  const success = await updateFrontmatter(filePath, {
    version: newVersion,
    lastUpdated: newDate,
    changeNotes: changeNotes
  });
  
  if (!success) {
    console.error(`Failed to update frontmatter for ${filename}`);
    return false;
  }
  
  // Update the manifest
  entry.version = newVersion;
  entry.lastUpdated = newDate;
  entry.changeNotes = changeNotes;
  
  // Add to version history
  if (!entry.history) {
    entry.history = [];
  }
  
  entry.history.push({
    version: newVersion,
    date: newDate,
    notes: changeNotes
  });
  
  // Update content hash
  const newHash = await getFileHash(filePath);
  if (newHash) {
    entry.contentHash = newHash;
  }
  
  console.log(`✅ Updated ${filename}: ${currentVersion} → ${newVersion}`);
  return true;
}

/**
 * Get current date in YYYY-MM-DD format
 */
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Apply version updates for detected changes
 */
async function applyVersionUpdates() {
  console.log('🔄 Applying version updates...\n');
  
  const manifest = await readVersionManifest();
  if (!manifest) {
    console.error('❌ Could not read versions.json');
    return false;
  }
  
  const changes = await checkForChanges();
  if (changes.length === 0) {
    console.log('✅ No changes to apply.');
    return true;
  }
  
  let updatesApplied = 0;
  
  for (const change of changes) {
    if (change.incrementType && change.changeNotes) {
      const success = await updateStyleguideVersion(
        change.filename,
        change.incrementType,
        change.changeNotes,
        manifest
      );
      
      if (success) {
        updatesApplied++;
      }
    } else {
      console.log(`⚠️  Skipping ${change.filename} - no increment type determined`);
    }
  }
  
  if (updatesApplied > 0) {
    const manifestSaved = await writeVersionManifest(manifest);
    if (manifestSaved) {
      console.log(`\n🎉 Successfully updated ${updatesApplied} styleguide(s)!`);
      console.log('📋 Version manifest updated.');
    } else {
      console.error('❌ Failed to save version manifest');
      return false;
    }
  }
  
  return true;
}

/**
 * Update a single styleguide version manually
 */
async function updateSingleVersion(filename, incrementType, customNotes) {
  console.log(`🔄 Updating ${filename}...\n`);
  
  const manifest = await readVersionManifest();
  if (!manifest) {
    console.error('❌ Could not read versions.json');
    return false;
  }
  
  const changeNotes = customNotes || generateChangeNotes(null, incrementType);
  const success = await updateStyleguideVersion(filename, incrementType, changeNotes, manifest);
  
  if (success) {
    const manifestSaved = await writeVersionManifest(manifest);
    if (manifestSaved) {
      console.log('\n✅ Version updated successfully!');
      return true;
    } else {
      console.error('❌ Failed to save version manifest');
    }
  }
  
  return false;
}

/**
 * Display version history for a styleguide
 */
async function showVersionHistory(filename) {
  const manifest = await readVersionManifest();
  if (!manifest) {
    console.error('❌ Could not read versions.json');
    return false;
  }
  
  const slug = filename.toLowerCase()
    .replace('.md', '')
    .replace(/\s+/g, '-')
    .replace(/[äöü]/g, match => ({ 'ä': 'ae', 'ö': 'oe', 'ü': 'ue' }[match] || match));
  
  const entry = manifest.styleguides[slug];
  if (!entry) {
    console.error(`No manifest entry found for ${filename}`);
    return false;
  }
  
  console.log(`📚 Version History: ${entry.title}\n`);
  console.log(`Current Version: ${entry.version} (${entry.lastUpdated})`);
  console.log('─'.repeat(50));
  
  if (!entry.history || entry.history.length === 0) {
    console.log('No version history available.');
    return true;
  }
  
  // Sort history by version (newest first)
  const sortedHistory = entry.history.sort((a, b) => {
    const [aMajor, aMinor, aPatch] = a.version.split('.').map(Number);
    const [bMajor, bMinor, bPatch] = b.version.split('.').map(Number);
    
    if (bMajor !== aMajor) return bMajor - aMajor;
    if (bMinor !== aMinor) return bMinor - aMinor;
    return bPatch - aPatch;
  });
  
  for (const historyEntry of sortedHistory) {
    console.log(`\n📦 Version ${historyEntry.version} (${historyEntry.date})`);
    console.log(`   ${historyEntry.notes}`);
  }
  
  console.log(`\n📊 Total versions: ${entry.history.length}`);
  
  return true;
}

/**
 * Show version history for all styleguides
 */
async function showAllVersionHistory() {
  const manifest = await readVersionManifest();
  if (!manifest) {
    console.error('❌ Could not read versions.json');
    return false;
  }
  
  console.log('📚 All Styleguides Version History\n');
  console.log('═'.repeat(60));
  
  for (const [slug, entry] of Object.entries(manifest.styleguides)) {
    console.log(`\n📋 ${entry.title}`);
    console.log(`   Current: v${entry.version} (${entry.lastUpdated})`);
    console.log(`   Versions: ${entry.history ? entry.history.length : 1}`);
    console.log(`   Latest: ${entry.changeNotes}`);
  }
  
  console.log('\n💡 Use "npm run version:history <filename>" to see detailed history');
  
  return true;
}

/**
 * Interactive version update with user confirmation
 */
async function interactiveVersionUpdate() {
  console.log('🔍 Scanning for changes...\n');
  
  const changes = await checkForChanges();
  if (changes.length === 0) {
    console.log('✅ No changes detected. Nothing to update.');
    return true;
  }
  
  console.log('\n📝 Proposed updates:');
  for (const change of changes) {
    if (change.incrementType) {
      console.log(`  ${change.filename}:`);
      console.log(`    Current: ${change.slug}`);
      console.log(`    Proposed: ${change.suggestedVersion} (${change.incrementType.toUpperCase()})`);
      console.log(`    Notes: ${change.changeNotes}`);
      console.log('');
    }
  }
  
  // For now, auto-apply all changes
  // In the future, this could prompt for user confirmation
  console.log('🚀 Applying all updates...\n');
  return await applyVersionUpdates();
}

/**
 * Main function to check all styleguides for changes
 */
async function checkForChanges() {
  console.log('🔍 Checking for changes in styleguide files...\n');
  
  const manifest = await readVersionManifest();
  if (!manifest) {
    console.error('❌ Could not read versions.json');
    process.exit(1);
  }
  
  const files = await getStyleguideFiles();
  const changes = [];
  
  for (const file of files) {
    const result = await detectChanges(file, manifest);
    if (result && result.hasChanged) {
      changes.push(result);
    }
  }
  
  if (changes.length === 0) {
    console.log('✅ No changes detected in styleguide files.');
  } else {
    console.log(`📝 Found changes in ${changes.length} file(s):\n`);
    for (const change of changes) {
      if (change.incrementType) {
        console.log(`  - ${change.filename} (${change.incrementType.toUpperCase()}: ${change.suggestedVersion})`);
      } else {
        console.log(`  - ${change.filename}`);
      }
    }
  }
  
  return changes;
}

/**
 * Post-build version validation and cleanup
 */
async function postBuildVersionCheck() {
  console.log('🏁 Running post-build version checks...\n');
  
  const manifest = await readVersionManifest();
  if (!manifest) {
    console.error('❌ Could not read versions.json');
    return false;
  }
  
  let allValid = true;
  let totalGuides = 0;
  let validVersions = 0;
  
  console.log('📊 Version Summary:');
  console.log('==================');
  
  for (const [slug, entry] of Object.entries(manifest.styleguides)) {
    totalGuides++;
    
    // Check if file exists
    const filePath = path.join(CONFIG.styleguideDir, entry.filename);
    try {
      await fs.access(filePath);
      
      // Validate version format
      const versionRegex = /^\d+\.\d+\.\d+$/;
      if (!versionRegex.test(entry.version)) {
        console.log(`❌ ${entry.filename}: Invalid version format (${entry.version})`);
        allValid = false;
      } else {
        console.log(`✅ ${entry.filename}: v${entry.version} (${entry.lastUpdated})`);
        validVersions++;
      }
      
      // Check if frontmatter exists
      const frontmatter = await parseFrontmatter(filePath);
      
      if (!frontmatter || !frontmatter.version) {
        console.log(`⚠️  ${entry.filename}: Missing version in frontmatter`);
      }
      
    } catch (error) {
      console.log(`❌ ${entry.filename}: File not found`);
      allValid = false;
    }
  }
  
  console.log('\n📈 Build Stats:');
  console.log(`   • Total Styleguides: ${totalGuides}`);
  console.log(`   • Valid Versions: ${validVersions}`);
  
  const latestUpdate = Object.values(manifest.styleguides)
    .map(e => new Date(e.lastUpdated))
    .reduce((latest, current) => current > latest ? current : latest);
  console.log(`   • Latest Update: ${latestUpdate.toISOString().split('T')[0]}`);
  
  if (allValid) {
    console.log('\n✅ All version checks passed! Build is ready for deployment.');
  } else {
    console.log('\n❌ Some version checks failed. Please review and fix issues before deployment.');
  }
  
  return allValid;
}

/**
 * Generate a versioned ZIP package for distribution
 */
async function generateVersionedZip() {
  console.log('📦 Generating versioned ZIP package...\n');
  
  const manifest = await readVersionManifest();
  if (!manifest) {
    console.error('❌ Could not read version manifest');
    return false;
  }
  
  try {
    // Note: This would require adding JSZip dependency to Node.js environment
    // For now, just generate the metadata files that would go in the ZIP
    
    const outputDir = path.join(__dirname, '../dist/zip-package');
    await fs.mkdir(outputDir, { recursive: true });
    
    // Generate README
    const currentDate = new Date().toLocaleDateString('de-DE');
    const latestUpdate = Object.values(manifest.styleguides)
      .map(e => new Date(e.lastUpdated))
      .reduce((latest, current) => current > latest ? current : latest)
      .toLocaleDateString('de-DE');
    
    const fileList = Object.values(manifest.styleguides)
      .map(entry => `- ✅ ${entry.filename} (v${entry.version} - ${entry.lastUpdated})`)
      .join('\n');
    
    const readme = `# KI-Styleguides Komplettpaket

Vielen Dank für das Herunterladen!

## Enthaltene Dateien mit Versionen

${fileList}

## Versionsinformationen

- **Paket erstellt am:** ${currentDate}
- **Letzte Aktualisierung:** ${latestUpdate}
- **Gesamtanzahl Styleguides:** ${Object.keys(manifest.styleguides).length}

## Verwendung

1. Wählen Sie den passenden Styleguide für Ihr Projekt
2. Kopieren Sie den Inhalt in Ihr KI-Tool (Claude Projects, ChatGPT Custom Instructions, etc.)
3. Schreiben Sie bessere Texte mit konsistenter Qualität

## Weitere Informationen

- Website: https://cs-style-guides.vercel.app
- Anleitung: https://cs-style-guides.vercel.app/anwendung/
- GitHub: https://github.com/chrisschwer/CS-Style-Guides

## Lizenz

Alle Inhalte stehen unter der CC BY 4.0 Lizenz.
- ✅ Kostenlose Nutzung für private und kommerzielle Zwecke
- ✅ Bearbeitung und Weiterverteilung erlaubt  
- ℹ️ Namensnennung erforderlich

**Attribution-Beispiel:**
Basierend auf "KI-Styleguides" von Christoph Schwerdtfeger, CC BY 4.0

---
Generiert am: ${currentDate}
Paket-Version: ${manifest.schema?.version || '1.0'}`;

    await fs.writeFile(path.join(outputDir, '00-README-ZUERST-LESEN.md'), readme, 'utf8');
    
    // Copy version manifest
    await fs.writeFile(path.join(outputDir, 'versions.json'), JSON.stringify(manifest, null, 2), 'utf8');
    
    // Copy all styleguide files
    const sourceFiles = await getStyleguideFiles();
    for (const filename of sourceFiles) {
      const sourcePath = path.join(CONFIG.styleguideDir, filename);
      const targetPath = path.join(outputDir, filename);
      await fs.copyFile(sourcePath, targetPath);
    }
    
    // Generate filename for the package
    const latestUpdateDate = Object.values(manifest.styleguides)
      .map(e => new Date(e.lastUpdated))
      .reduce((latest, current) => current > latest ? current : latest);
    const latestVersion = latestUpdateDate.toISOString().split('T')[0];
    
    const versionCounts = Object.values(manifest.styleguides).reduce((counts, entry) => {
      const [major, minor, patch] = entry.version.split('.').map(Number);
      if (major > 1) counts.major++;
      else if (minor > 0) counts.minor++;
      else counts.patch++;
      return counts;
    }, { major: 0, minor: 0, patch: 0 });
    
    const versionSummary = [];
    if (versionCounts.major > 0) versionSummary.push(`${versionCounts.major}major`);
    if (versionCounts.minor > 0) versionSummary.push(`${versionCounts.minor}minor`);
    if (versionCounts.patch > 0) versionSummary.push(`${versionCounts.patch}patch`);
    
    const versionString = versionSummary.length > 0 ? `-${versionSummary.join('-')}` : '';
    const packageName = `ki-styleguides-${latestVersion}-${sourceFiles.length}guides${versionString}`;
    
    console.log(`✅ Package prepared in: ${outputDir}`);
    console.log(`📦 Suggested package name: ${packageName}.zip`);
    console.log(`📊 Package contents:`);
    console.log(`   • ${sourceFiles.length} styleguide files`);
    console.log(`   • 1 README file`);
    console.log(`   • 1 version manifest`);
    console.log(`   • Latest update: ${latestVersion}`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Error generating ZIP package:', error);
    return false;
  }
}

/**
 * Run the version manager
 */
async function run() {
  try {
    const command = process.argv[2] || 'check';
    
    switch (command) {
      case 'check':
        const changes = await checkForChanges();
        if (changes.length > 0) {
          console.log('\nℹ️  To update versions, run: npm run version:update');
        }
        break;
        
      case 'init-hashes':
        await updateContentHashes();
        break;
        
      case 'update':
        await interactiveVersionUpdate();
        break;
        
      case 'apply':
        await applyVersionUpdates();
        break;
        
      case 'bump':
        const filename = process.argv[3];
        const incrementType = process.argv[4];
        const customNotes = process.argv[5];
        
        if (!filename || !incrementType) {
          console.log('Usage: node version-manager.js bump <filename> <patch|minor|major> [notes]');
          process.exit(1);
        }
        
        if (!['patch', 'minor', 'major'].includes(incrementType)) {
          console.log('Error: increment type must be patch, minor, or major');
          process.exit(1);
        }
        
        await updateSingleVersion(filename, incrementType, customNotes);
        break;
        
      case 'history':
        const historyFilename = process.argv[3];
        
        if (!historyFilename) {
          await showAllVersionHistory();
        } else {
          await showVersionHistory(historyFilename);
        }
        break;
        
      case 'post-build':
        await postBuildVersionCheck();
        break;
        
      case 'generate-zip':
        await generateVersionedZip();
        break;
        
      default:
        console.log(`Unknown command: ${command}`);
        console.log('Available commands:');
        console.log('  check - Check for changes in styleguide files');
        console.log('  init-hashes - Initialize content hashes for all files');
        console.log('  update - Interactive version update for changed files');
        console.log('  apply - Apply version updates for detected changes');
        console.log('  bump <file> <type> [notes] - Manually bump version for a specific file');
        console.log('  history [file] - Show version history (all files or specific file)');
        console.log('  post-build - Post-build version validation and cleanup');
        console.log('  generate-zip - Generate a versioned ZIP package for distribution');
        process.exit(1);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error running version manager:', error);
    process.exit(1);
  }
}

// Export functions for testing
module.exports = {
  getStyleguideFiles,
  readVersionManifest,
  writeVersionManifest,
  getGitDiff,
  getFileHash,
  parseFrontmatter,
  updateFrontmatter,
  analyzeChangeScope,
  incrementVersion,
  generateChangeNotes,
  getCurrentDate,
  detectChanges,
  checkForChanges,
  updateContentHashes,
  updateStyleguideVersion,
  applyVersionUpdates,
  updateSingleVersion,
  interactiveVersionUpdate,
  showVersionHistory,
  showAllVersionHistory,
  postBuildVersionCheck,
  generateVersionedZip
};

// Run if called directly
if (require.main === module) {
  run();
}