import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

const base = process.env.VITE_BASE ?? '/';

export default defineConfig(({ command }) => ({
  root: '.',
  base,
  publicDir: false,
  plugins: command === 'build' ? [viteSingleFile()] : [],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: false,
    open: false,
  },
}));
