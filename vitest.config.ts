import { defineConfig } from 'vitest/config';
import tsConfig from './tsconfig.json' with { type: 'json' };

export default defineConfig({
  test: {
    globals: true,
    silent: true,
    coverage: { enabled: true, include: tsConfig.include },
  },
});
