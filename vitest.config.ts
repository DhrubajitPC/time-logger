import { defineConfig } from 'vitest/config';

// Standalone config for tests so the PWA build plugin isn't loaded.
// The units under test are pure functions, so the default node environment
// is enough (no jsdom needed).
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
