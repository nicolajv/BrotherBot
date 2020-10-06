// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  projects: ["dist/tests"],
  testPathIgnorePatterns: ["/node_modules/", "/src/"],
  testEnvironment: "node",
  collectCoverage: true,
  collectCoverageFrom: ['dist/**'],
  coverageDirectory: 'coverage'
};
