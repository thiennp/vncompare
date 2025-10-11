export default {
  // File patterns to include
  includes: [
    'app/features/shared/types/index.ts',
    'app/features/shared/types/*.ts',
  ],
  
  // File patterns to exclude
  excludes: [
    'node_modules/**/*',
    '**/*.test.ts',
    '**/*.spec.ts',
    '**/*.guardz.ts',
    'dist/**/*'
  ],
};
