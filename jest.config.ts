import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.jest.json',
        diagnostics: {
          ignoreCodes: [1343],
        },
        astTransformers: {
          before: [
            {
              path: 'ts-jest-mock-import-meta',
              options: {
                metaObjectReplacement: {
                  env: {
                    VITE_API_BASE_URL: 'http://localhost:3000',
                    VITE_API_MODE: 'mock',
                    VITE_DEV_ACCESS_TOKEN: 'dev-token-123',
                    VITE_DEV_USER_ID: 'user-dev-1',
                  },
                },
              },
            },
          ],
        },
      },
    ],
  },
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/01-app/$1',
    '^@pages/(.*)$': '<rootDir>/src/02-pages/$1',
    '^@widgets/(.*)$': '<rootDir>/src/03-widgets/$1',
    '^@features/(.*)$': '<rootDir>/src/04-features/$1',
    '^@entities/(.*)$': '<rootDir>/src/05-entities/$1',
    '^@shared/(.*)$': '<rootDir>/src/06-shared/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/main.tsx',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],
};

export default config;
