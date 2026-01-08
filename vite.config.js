import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { getPlugin } from 'advanced-svg-fetcher'
import rollupNodePolyFill from 'rollup-plugin-polyfill-node'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())
  const offlineSafeMode = env.VITE_OFFLINE_SAFE_MODE === 'true'

  return {
    plugins: [
      react(),
      ...(offlineSafeMode ? [] : [getPlugin()]), // ✅ disable network fetcher in offline mode
    ],

    define: {
      'process.env': {
        VITE_DCL_DEFAULT_ENV: env.VITE_DCL_DEFAULT_ENV,
        VITE_BASE_URL: env.VITE_BASE_URL,
      },
      global: 'globalThis',
    },

    resolve: {
      alias: {
        crypto: 'crypto-browserify',
        stream: 'stream-browserify',
        buffer: 'buffer',
        util: 'util',
        assert: 'assert',
        process: 'process/browser',

        assets: '/src/assets',
        components: '/src/components',
        containers: '/src/containers',
        contracts: '/src/contracts',
        helpers: '/src/helpers',
        hooks: '/src/hooks',
        providers: '/src/providers',
      },
    },

    optimizeDeps: {
      include: ['buffer', 'process', 'crypto-browserify', 'stream-browserify'],
      esbuildOptions: {
        define: { global: 'globalThis' },
        plugins: [
          NodeGlobalsPolyfillPlugin({ process: true, buffer: true }),
          NodeModulesPolyfillPlugin(),
        ],
      },
    },

    build: {
      sourcemap: true,
      rollupOptions: {
        plugins: [rollupNodePolyFill()],
      },
    },

    ...(command === 'build' ? { base: env.VITE_BASE_URL } : undefined),
  }
})
