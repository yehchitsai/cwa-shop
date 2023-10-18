import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { viteMockServe } from 'vite-plugin-mock'
import { version, name } from './package.json'

const root = resolve(__dirname, 'src')
const outDir = resolve(__dirname, 'dist')
const envDir = resolve(__dirname, 'environments')
const endpointFileName = 'index.html'

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
      'window.APP_BASENAME': `"${process.env.BASENAME ? `/${name}` : '/'}"`,
      'window.IS_MOCK': `${isMock}`,
      'window.IS_MOCK_AWS_API': `${isMockAwsApi}`
    },
    root,
    plugins: [
      react(),
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
        input: {
          main: resolve(root, endpointFileName)
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
