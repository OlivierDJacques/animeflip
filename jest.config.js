module.exports = {
    collectCoverage: true, 
    collectCoverageFrom: [
      "**/*.js", 
      "!**/node_modules/**", 
      "!**/vendor/**", 
      "!**/coverage/**", 
      "!jest.config.js",
      "!**/test-*.js"
    ],

    coverageThreshold: {
      global: {
        branches: 2,
        functions: 2,
        lines: 2,
        statements: 2,
      },
    },

    coverageReporters: ["json", "lcov", "text", "clover"],
  };