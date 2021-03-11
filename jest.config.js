/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

module.exports = {
  // Run tests from one or more projects
  projects: [
    {
      runner: 'jest-runner-eslint',
      displayName: 'linting',
      testMatch: [
        '<rootDir>/src/*.js',
        '<rootDir>/src/**/*.js',
      ],
    },
    {
      displayName: 'testing',
      testMatch: [
        '<rootDir>/src/**/*.spec.js',
      ],
      moduleFileExtensions: ['js', 'vue'],
      moduleDirectories: [
        'node_modules',
        'src',
      ],
      transform: {
        '^.+\\.js$': 'babel-jest',
        '^.+\\.vue$': 'vue-jest'
      },
      coverageDirectory: 'coverage',
    },
  ],
}
