import type { GuardzGeneratorConfig } from 'guardz-generator';

const config: GuardzGeneratorConfig = {
  // Input files to generate type guards from
  includes: [
    'app/features/shared/types/index.ts',
    'app/features/shared/types/*.ts',
  ],
  
  // Files to exclude from generation
  excludes: [
    '**/*.guardz.ts',
    '**/*.test.ts',
    '**/*.spec.ts',
    'node_modules/**',
  ],
  
  // Output directory for generated type guards
  outputDir: 'app/features/shared/types',
  
  // File naming pattern for generated guards
  filePattern: '{name}.guardz.ts',
  
  // TypeScript configuration
  tsConfig: 'tsconfig.json',
  
  // Additional options
  options: {
    // Generate guards for all exported types
    generateForAllExports: true,
    
    // Include JSDoc comments in generated guards
    includeJSDoc: true,
    
    // Generate guards with detailed error messages
    detailedErrors: true,
    
    // Enable recursion detection
    enableRecursionDetection: true,
    
    // Handle enum types
    handleEnums: true,
  },
};

export default config;
