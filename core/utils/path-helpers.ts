import path from 'path';
import { REPO_ROOT } from '../config';

/**
 * Resolve an absolute path relative to the repository root.
 */
export function resolveToRoot(...pathSegments: string[]): string {
  return path.resolve(REPO_ROOT, ...pathSegments);
}

/**
 * Resolve an absolute path relative to the output directory.
 */
export function resolveToDist(...pathSegments: string[]) {
  return path.resolve(REPO_ROOT, 'dist', ...pathSegments);
}

/**
 * Get a relative path to the target template.
 */
export function getRelativeTemplatePath(scaffoldName: string) {
  return path.join('scaffolds', scaffoldName, 'template');
}

/**
 * Resolve an absolute path to the target template.
 *
 * NOTE: this is always resolved from the repository root (not `/dist`),
 * so that we can download templates from the remote repository if necessary.
 */
export function getAbsoluteTemplatePath(scaffoldName: string) {
  return resolveToRoot('scaffolds', scaffoldName, 'template');
}
