import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression'
import { viteMockServe } from 'vite-plugin-mock'
import { resolve } from 'path'

// https://vitejs.cn/guide/env-and-mode.html#env-files
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "./")
  console.log(env)
  return {
    plugins: [
      vue(),
      // this is a gzip plugin to generate the .js.gz file
      viteCompression(),
      // viteMockServe({
      //   mockPath: 'mock',
      //   enable: false
      // }),
    ],
    pluginOptions: {
      'style-resources-loader': {
        preProcessor: 'scss',
        patterns: []
      }
    },
    base: env.VITE_RES_URL,
    resolve: {
      alias: {
        '@': resolve("./", 'src')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/style/mixin.scss";`
        }
      }
    },
    build: {
      assetsDir: 'resets',
    },
  }
})


