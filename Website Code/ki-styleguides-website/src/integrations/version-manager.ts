/**
 * Astro Integration for Version Management
 * Runs version checks during build process
 */

import type { AstroIntegration } from 'astro';
import { execSync } from 'child_process';
import path from 'path';

export default function versionManagerIntegration(): AstroIntegration {
  return {
    name: 'version-manager',
    hooks: {
      'astro:build:start': async ({ logger }) => {
        logger.info('🔍 Running version checks...');
        
        try {
          // Run version check
          const scriptPath = path.resolve('./scripts/version-manager.cjs');
          execSync(`node "${scriptPath}" check`, { 
            stdio: 'inherit',
            cwd: process.cwd()
          });
          
          // Update content hashes
          execSync(`node "${scriptPath}" init-hashes`, { 
            stdio: 'inherit',
            cwd: process.cwd()
          });
          
          // Sync files with correct version information
          const syncScriptPath = path.resolve('./scripts/sync-files.cjs');
          execSync(`node "${syncScriptPath}" sync`, { 
            stdio: 'inherit',
            cwd: process.cwd()
          });
          
          logger.info('✅ Version checks and file sync completed');
        } catch (error) {
          logger.error('❌ Version check failed:', error);
          throw error;
        }
      },
      
      'astro:build:done': async ({ logger }) => {
        logger.info('🏁 Running post-build version validation...');
        
        try {
          const scriptPath = path.resolve('./scripts/version-manager.cjs');
          execSync(`node "${scriptPath}" post-build`, { 
            stdio: 'inherit',
            cwd: process.cwd()
          });
          
          logger.info('✅ Post-build validation completed');
        } catch (error) {
          logger.warn('⚠️ Post-build validation warnings:', error);
          // Don't fail the build on post-build warnings
        }
      }
    }
  };
}