import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
// @ts-expect-error vite-plugin-eslint types not exported via package.json "exports"
import eslint from 'vite-plugin-eslint';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
});
