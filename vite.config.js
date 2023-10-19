import fs from 'fs'
import { resolve } from 'path'
import { defineConfig, splitVendorChunkPlugin, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { viteMockServe } from 'vite-plugin-mock'
import { sync } from 'glob'
import { version, name } from './package.json'

const outDir = resolve(__dirname, 'dist')
const envDir = resolve(__dirname, 'environments')

// https://vitejs.dev/config/
export default ({ mode }) => {
  const isMock = !!process.env.MOCK
  const isMockAwsApi = !!process.env.MOCK_AWS_API
  const modeEnv = loadEnv(isMock ? 'mock' : mode, envDir)
  process.env = { ...process.env, ...modeEnv }
  const viteConfig = {
    base: './',
    envDir,
    define: {
      'window.APP_VERSION': `"${version}"`,
      'window.APP_BASENAME': `"${process.env.BASENAME ? `/${name}` : ''}"`,
      'window.IS_MOCK': `${isMock}`,
      'window.IS_MOCK_AWS_API': `${isMockAwsApi}`
    },
    root: 'src/sites/',
    plugins: [
      react(),
      splitVendorChunkPlugin(),
      viteMockServe({
        mockPath: './src/mock',
        localEnabled: isMock
      })
    ],
    build: {
      outDir,
      emptyOutDir: true,
      assetsDir: 'assets',
      rollupOptions: {
        input: Object.fromEntries(
          sync('src/sites/**/index.html').map((file) => [
            file.replace('src/sites/', '').replace('/index.html', ''),
            file
          ])
        ),
        output: {
          entryFileNames: (assetInfo) => {
            const { name: entryName } = assetInfo
            const file404 = `
              <!DOCTYPE html>
              <script>
                console.log(window.location.pathname)
                sessionStorage.setItem('redirectPath', window.location.pathname)
                window.location.href = './'
              </script>
            `
            if (entryName === 'index.html') {
              fs.writeFileSync(
                'dist/404.html',
                file404,
                'utf-8'
              )
            } else {
              fs.mkdirSync(`dist/${entryName}`)
              fs.writeFileSync(
                `dist/${entryName}/404.html`,
                file404,
                'utf-8'
              )
            }

            return 'assets/[name]-[hash].js'
          }
        }
      }
    },
    server: {
      proxy: {
        '/api': {
          target: isMock ? process.env.VITE_LOCAL_MOCK_API_HOST : process.env.VITE_MOCK_API_HOST,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
  return defineConfig(viteConfig)
}
