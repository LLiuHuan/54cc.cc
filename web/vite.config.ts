import type { ConfigEnv, UserConfig } from 'vite';
import { loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { wrapperEnv } from './build/utils';
import { format } from 'date-fns';
import WindiCSS from 'vite-plugin-windicss';
import alias from '@rollup/plugin-alias';
import pkg from './package.json';
import { OUTPUT_DIR } from './build/constant';
import Components from 'unplugin-vue-components/vite';
import { ArcoResolver } from 'unplugin-vue-components/resolvers';
import OptimizationPersist from 'vite-plugin-optimize-persist';
import PkgConfig from 'vite-plugin-package-config';

// 删了就不好使？
// import eslintPlugin from "vite-plugin-eslint";

const { dependencies, devDependencies, name, version } = pkg;

const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
};

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);
  const { VITE_PORT, VITE_BASE_URL } = viteEnv;
  // const isBuild = command === 'build';
  // const alias: Record<string, string> = {
  //   // '@': `${resolve(__dirname, 'src')}/`,
  // };
  //
  // if (env) {
  //   // 解决警告You are running the esm-bundler build of vue-i18n.
  //   alias['vue-i18n'] = 'vue-i18n/dist/vue-i18n.cjs.js';
  // }

  return {
    plugins: [
      vue(),
      alias(),
      Components({
        resolvers: [ArcoResolver()],
      }),
      WindiCSS(),
      PkgConfig(),
      OptimizationPersist(),
    ],
    esbuild: {},
    base: VITE_BASE_URL,
    resolve: {
      alias: [
        {
          find: /\/#\//,
          replacement: pathResolve('types') + '/',
        },
        {
          find: '@',
          replacement: pathResolve('src') + '/',
        },
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
        },
      ],
      dedupe: ['vue'],
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          // Customize stylings here
          modifyVars: {
            // arcoblue-6 is the primary-color :)))
            // TODO: 动态
            'arcoblue-6': '#1DA57A', // 绿色
            // 'arcoblue-6': '#165DFF', // 蓝色
          },
        },
      },
    },
    server: {
      host: true,
      port: VITE_PORT,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    optimizeDeps: {
      include: [],
      exclude: ['vue-demi'],
    },
    build: {
      target: 'es2015',
      outDir: OUTPUT_DIR,
      // terserOptions: {
      //   compress: {
      //     keep_infinity: true,
      //     drop_console: VITE_DROP_CONSOLE,
      //   },
      // },
      brotliSize: false,
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          },
        },
      },
    },
  };
};
