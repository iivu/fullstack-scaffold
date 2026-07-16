import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';

import { tanstackStart } from '@tanstack/react-start/plugin/vite';

import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig, loadEnv } from 'vite';

function log(...args: any[]) {
  const time = new Date().toISOString();
  console.log(`[${time}]`, ...args);
}

const config = defineConfig(({ mode, command }) => {
  const isBuild = command === 'build';
  const env = loadEnv(mode, process.cwd(), '');
  log('isBuild', isBuild);
  log('VITE_APP_NAME', env.VITE_APP_NAME);
  return {
    base: isBuild ? '' : '/',
    resolve: { tsconfigPaths: true },
    plugins: [
      devtools(),
      nitro({ rollupConfig: { external: [/^@sentry\//] } }),
      tailwindcss(),
      tanstackStart({
        spa: {
          enabled: true,
        },
        router: { basepath: isBuild ? '' : '/' },
      }),
      viteReact(),
    ],
  };
});

export default config;
