/**
 * Prettier configuration for Recipedia React Native project
 * 
 * Provides consistent code formatting rules across the entire codebase
 * optimized for React Native and TypeScript development.
 */

module.exports = {
  // Basic formatting
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'es5',
  
  // Indentation and spacing
  tabWidth: 2,
  useTabs: false,
  
  // Line handling
  printWidth: 100,
  endOfLine: 'lf',
  
  // JSX specific
  jsxSingleQuote: true,
  bracketSameLine: false,
  
  // Arrow functions
  arrowParens: 'avoid',
  
  // File patterns to format
  overrides: [
    {
      files: ['*.json', '*.jsonc'],
      options: {
        printWidth: 120,
      },
    },
    {
      files: ['*.md', '*.mdx'],
      options: {
        printWidth: 80,
        proseWrap: 'always',
      },
    },
  ],
};
