import { Config } from '@jest/types'
// @ts-ignore
import { resolvePath } from '../../scripts/utils.js'

export default {
  rootDir: resolvePath(),
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@test/(.*)$': '<rootDir>/test/unit/$1'
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  modulePathIgnorePatterns: [],
  setupFiles: ['<rootDir>/test/unit/setup'],
  coverageDirectory: '<rootDir>/test/unit/coverage',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}'
  ],
  testRegex: [
    '/test/unit/specs/.+\\.(test|spec)\\.[jt]sx?$'
  ]
} as Config.InitialOptions
