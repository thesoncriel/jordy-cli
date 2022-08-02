/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    legacy({
      // > 0.5%, last 2 versions, Firefox ESR, not dead
      targets: ['defaults', 'not IE 11'],
    }),
  ],
  test: {
    exclude: ['node_modules'],
    globals: true,
  },
});
