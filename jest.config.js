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
        branches: 45,
        functions: 45,
        lines: 34,
        statements: 45,
      },
    },

    coverageReporters: ["json", "lcov", "text", "clover"],
  };