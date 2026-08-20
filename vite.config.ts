import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src/01-app'),
      '@pages': path.resolve(__dirname, 'src/02-pages'),
      '@widgets': path.resolve(__dirname, 'src/03-widgets'),
      '@features': path.resolve(__dirname, 'src/04-features'),
      '@entities': path.resolve(__dirname, 'src/05-entities'),
      '@shared': path.resolve(__dirname, 'src/06-shared'),
    },
  },
});
