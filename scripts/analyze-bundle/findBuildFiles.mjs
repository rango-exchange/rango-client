import fs from 'fs/promises';
import path from 'path';
import { BUILD_META_FILE_SUFFIX } from '../common/constants.mjs';

/**
 * Each artifact directory mirrors the hierarchy of our monorepo directory:
 *
 * branch-directory
 *  /widget
 *    /embedded
 *      widget-embedded.build.json
 *    /ui
 *      widget-ui.build.json
 *   ...
 */

/**
 * Recursively searches for ESBuild meta JSON files in the specified directory.
 * @param {string} directory - The directory to search in.
 * @returns {Promise<string[]>} - A promise resolving to an array of file paths to ESBuild meta JSON files found in the directory and its subdirectories.
 */
export async function findBuildJsonFiles(directory) {
  const files = [];

  /**
   * Recursively traverses the directory to find ESBuild meta JSON files.
   * @param {string} currentDir - The current directory to traverse.
   * @returns {Promise<void>} - A promise that resolves when the traversal is complete.
   */
  async function traverseDirectory(currentDir) {
    const dirContents = await fs.readdir(currentDir);
    for (const item of dirContents) {
      const itemPath = path.join(currentDir, item);
      const stats = await fs.stat(itemPath);
      const isDirectory = stats.isDirectory();

      if (isDirectory) {
        await traverseDirectory(itemPath);
      } else if (item.endsWith(BUILD_META_FILE_SUFFIX)) {
        files.push(itemPath);
      }
    }
  }

  await traverseDirectory(directory);
  return files;
}
