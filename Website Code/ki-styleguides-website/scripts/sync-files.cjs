#!/usr/bin/env node

/**
 * File Synchronization Script
 * Synchronizes styleguide files from source to public directory with correct version frontmatter
 */

const fs = require('fs').promises;
const path = require('path');

// Configuration
const CONFIG = {
  sourceDir: path.join(__dirname, '../../../Styleguides'),
  targetDir: path.join(__dirname, '../public/files'),
  versionsFile: path.join(__dirname, '../../../versions.json'),
  ignoredFiles: ['README.md', 'LICENSE']
};

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
 * Parse frontmatter from markdown content
 */
function parseFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  
  if (!frontmatterMatch) {
    return { frontmatter: null, content };
  }
  
  const frontmatter = {};
  const lines = frontmatterMatch[1].split('\n');
  
  for (const line of lines) {
    if (line.trim()) {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        let value = valueParts.join(':').trim();
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        frontmatter[key.trim()] = value;
      }
    }
  }
  
  const contentWithoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n/, '');
  return { frontmatter, content: contentWithoutFrontmatter };
}

/**
 * Create frontmatter string from object
 */
function createFrontmatter(frontmatterObj) {
  let frontmatter = '---\n';
  for (const [key, value] of Object.entries(frontmatterObj)) {
    frontmatter += `${key}: "${value}"\n`;
  }
  frontmatter += '---\n\n';
  return frontmatter;
}

/**
 * Update file with correct version information
 */
async function updateFileWithVersion(filename, versionEntry) {
  const sourcePath = path.join(CONFIG.sourceDir, filename);
  const targetPath = path.join(CONFIG.targetDir, filename);
  
  try {
    // Read source file
    const sourceContent = await fs.readFile(sourcePath, 'utf8');
    const { frontmatter: existingFrontmatter, content } = parseFrontmatter(sourceContent);
    
    // Create updated frontmatter with correct version info
    const updatedFrontmatter = {
      ...existingFrontmatter,
      version: versionEntry.version,
      lastUpdated: versionEntry.lastUpdated,
      changeNotes: versionEntry.changeNotes
    };
    
    // Combine frontmatter and content
    const updatedContent = createFrontmatter(updatedFrontmatter) + content;
    
    // Ensure target directory exists
    await fs.mkdir(CONFIG.targetDir, { recursive: true });
    
    // Write updated file to target
    await fs.writeFile(targetPath, updatedContent, 'utf8');
    
    console.log(`✅ Updated ${filename}: v${versionEntry.version}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error updating ${filename}:`, error);
    return false;
  }
}

/**
 * Get list of styleguide files from source directory
 */
async function getStyleguideFiles() {
  try {
    const files = await fs.readdir(CONFIG.sourceDir);
    return files.filter(file => 
      file.endsWith('.md') && 
      !CONFIG.ignoredFiles.includes(file)
    );
  } catch (error) {
    console.error('Error reading source directory:', error);
    return [];
  }
}

/**
 * Copy versions.json to public directory for browser access
 */
async function copyVersionManifest() {
  try {
    const targetPath = path.join(CONFIG.targetDir, '../versions.json');
    await fs.copyFile(CONFIG.versionsFile, targetPath);
    console.log('✅ Copied versions.json to public directory');
    return true;
  } catch (error) {
    console.error('❌ Error copying versions.json:', error);
    return false;
  }
}

/**
 * Synchronize all files
 */
async function syncFiles() {
  console.log('🔄 Synchronizing styleguide files with version information...\n');
  
  const manifest = await readVersionManifest();
  if (!manifest) {
    console.error('❌ Could not read version manifest');
    return false;
  }
  
  // Copy version manifest to public directory
  await copyVersionManifest();
  
  const sourceFiles = await getStyleguideFiles();
  let updatedCount = 0;
  let errorCount = 0;
  
  for (const filename of sourceFiles) {
    // Find corresponding version entry
    const versionEntry = Object.values(manifest.styleguides)
      .find(entry => entry.filename === filename);
    
    if (!versionEntry) {
      console.log(`⚠️  No version info found for ${filename}`);
      continue;
    }
    
    const success = await updateFileWithVersion(filename, versionEntry);
    if (success) {
      updatedCount++;
    } else {
      errorCount++;
    }
  }
  
  console.log(`\n📊 Synchronization Summary:`);
  console.log(`   • Files processed: ${sourceFiles.length}`);
  console.log(`   • Successfully updated: ${updatedCount}`);
  console.log(`   • Errors: ${errorCount}`);
  
  if (errorCount === 0) {
    console.log('\n✅ All files synchronized successfully!');
  } else {
    console.log('\n⚠️  Some files had errors during synchronization');
  }
  
  return errorCount === 0;
}

/**
 * Main execution
 */
async function run() {
  try {
    const command = process.argv[2] || 'sync';
    
    switch (command) {
      case 'sync':
        await syncFiles();
        break;
        
      default:
        console.log(`Unknown command: ${command}`);
        console.log('Available commands:');
        console.log('  sync - Synchronize files from source to public with correct versions');
        process.exit(1);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error running file sync:', error);
    process.exit(1);
  }
}

// Export functions for testing
module.exports = {
  readVersionManifest,
  parseFrontmatter,
  createFrontmatter,
  updateFileWithVersion,
  getStyleguideFiles,
  copyVersionManifest,
  syncFiles
};

// Run if called directly
if (require.main === module) {
  run();
}