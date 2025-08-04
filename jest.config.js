module.exports = {
    collectCoverage: true, 
    collectCoverageFrom: [
      "**/*.js", 
      "!**/node_modules/**", 
      "!**/vendor/**", 
      "!**/coverage/**", 
      "!jest.config.js",
      "!**/test-*.js",
      "!babel.config.js"
    ],

    coverageThreshold: {
      global: {
        branches: 20,
        functions: 20,
        lines: 20,
        statements: 20,
      },
    },

    coverageReporters: ["json", "lcov", "text", "clover"],
  };