import fs from 'fs'
import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { viteMockServe } from 'vite-plugin-mock'
import { sync } from 'glob'
import {
  flow, orderBy, size, uniq
} from 'lodash-es'
import { version, name } from './package.json'

const {
  NODE_ENV,
  BASENAME,
  PREVIEW,
  MOCK,
  MOCK_AWS_API,
  VITE_AWS_HOST_PREFIX: awsHostPrefix
} = process.env
const isMock = !!MOCK
const isMockAwsApi = !!MOCK_AWS_API
const isPreview = !!PREVIEW
const appBaseName = (BASENAME && !isPreview) ? `/${name}` : ''

const outDir = resolve(__dirname, 'dist')
const envDir = resolve(__dirname, 'environments')
const entriesDir = 'src/sites'
const entries = sync(`${entriesDir}/**/index.html`)
const entriesMap = Object.fromEntries(
  entries.map((entry) => {
    return [entry.replace(`${entriesDir}/`, '').replace('/index.html', ''), entry]
  })
)
const rootRoutesMap = Object.fromEntries(
  entries.map((entry) => {
    return [entry.replace(entriesDir, '').replace('index.html', ''), entry]
  })
)
const routes = flow(
  () => sync(`${entriesDir}/**/index.jsx`).reduce((collect, file) => {
    const route = file.replace('src/sites', '').replace('index.jsx', '').replace(/pages\//g, '')
    if (route !== '/') {
      const isEntryRoute = route in rootRoutesMap
      collect.push(
        `${appBaseName}${isEntryRoute ? route : route.replace(/\/$/, '')}`
      )
    }
    return collect
  }, []),
  uniq,
  (uniqRoutes) => orderBy(uniqRoutes, size, 'desc'),
  (sortedRoutes) => sortedRoutes.filter((sortedRoute) => sortedRoute.endsWith('/'))
)()

// https://vitejs.dev/config/
export default ({ mode }) => {
  const isProd = NODE_ENV === 'production'
  const modeEnv = loadEnv(isMock ? 'mock' : mode, envDir)
  const targetEnv = loadEnv(isProd ? 'production' : 'development', envDir)
  process.env = { ...process.env, ...modeEnv }
  const viteConfig = {
    base: isProd ? undefined : './',
    envDir,
    define: {
      'window.APP_VERSION': `"${version}"`,
      'window.APP_BASENAME': `"${appBaseName}"`,
      'window.AWS_HOST_PREFIX': `"${awsHostPrefix}"`,
      'window.IS_MOCK': `${isMock}`,
      'window.IS_MOCK_AWS_API': `${isMockAwsApi}`,
      'window.IS_PROD': `${isProd}`,
      'window.IS_PREVIEW': `${isPreview}`,
      'window.TARGET_ENV': `${JSON.stringify(targetEnv)}`
    },
    root: `${entriesDir}/`,
    plugins: [
      react(),
      viteMockServe({
        mockPath: './src/mock',
        localEnabled: isMock
      })
    ],
    experimental: {
      renderBuiltUrl: (filename) => {
        const prefix = 'assets'
        if (!filename.startsWith(prefix) && filename.includes('/')) {
          return `./${filename.split('/')[1]}`
        }

        return `./${filename.replace(/.*assets/, prefix)}`
      }
    },
    build: {
      outDir,
      emptyOutDir: true,
      rollupOptions: {
        input: entriesMap,
        output: {
          entryFileNames: (assetInfo) => {
            const { name: entryName } = assetInfo
            const file404 = `
              <!DOCTYPE html>
              <script>
                sessionStorage.removeItem('redirectPath')
                const routerPath = window.location.pathname.replace('${appBaseName}', '')
                if (routerPath !== '' && routerPath !== '/') {
                  sessionStorage.setItem('redirectPath', routerPath + window.location.search)
                }
                console.log(routerPath, '${entryName}')
                window.location.href = window.location.origin + '${appBaseName}'
              </script>
            `
            if (entryName === 'index.html') {
              fs.writeFileSync('dist/404.html', file404, 'utf-8')
              return '[name]-[hash].js'
            }

            fs.mkdirSync(`dist/${entryName}`)
            fs.mkdirSync(`dist/${entryName}/assets`)
            fs.writeFileSync(`dist/${entryName}/404.html`, file404, 'utf-8')
            // return `${entryName}/assets/[name]-[hash].js`
            return `${entryName}/[name]-[hash].js`
          }
        }
      }
    },
    server: {
      proxy: {
        [awsHostPrefix]: {
          // target: isMock ? process.env.VITE_LOCAL_MOCK_API_HOST : process.env.VITE_MOCK_API_HOST,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(new RegExp(`^${awsHostPrefix}`), '')
        }
      }
    }
  }
  return defineConfig(viteConfig)
}
