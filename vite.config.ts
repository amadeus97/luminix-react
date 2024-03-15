import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        formats: ['es'],
    },
    rollupOptions: {
      external: [
        '@luminix/core',
        'axios',
        'immer',
        'lodash',
        'react',
        'react-dom',
        'react-router-dom',
      ],
    }
  }
})
