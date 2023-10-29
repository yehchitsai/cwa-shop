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
  BASENAME,
  MOCK,
  MOCK_AWS_API,
  VITE_AWS_HOST_PREFIX: awsHostPrefix
} = process.env
const appBaseName = BASENAME ? `/${name}` : ''
const isMock = !!MOCK
const isMockAwsApi = !!MOCK_AWS_API

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
  const modeEnv = loadEnv(isMock ? 'mock' : mode, envDir)
  process.env = { ...process.env, ...modeEnv }
  const viteConfig = {
    base: './',
    envDir,
    define: {
      'window.APP_VERSION': `"${version}"`,
      'window.APP_BASENAME': `"${appBaseName}"`,
      'window.AWS_HOST_PREFIX': `"${awsHostPrefix}"`,
      'window.IS_MOCK': `${isMock}`,
      'window.IS_MOCK_AWS_API': `${isMockAwsApi}`
    },
    root: `${entriesDir}/`,
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
        input: entriesMap,
        output: {
          entryFileNames: (assetInfo) => {
            const { name: entryName } = assetInfo
            const file404 = `
              <!DOCTYPE html>
              <script>
                sessionStorage.removeItem('redirectPath')
                const pathname = window.location.pathname
                const isFolderPath = pathname.endsWith('/')
                const matchRoute = ${JSON.stringify(routes)}
                  .find((route) => pathname.startsWith(route)) || ''
                const isRouteExist = !!matchRoute
                console.log(pathname, isRouteExist, matchRoute, '${entryName}')
                if (!isRouteExist) {
                  const nextPathName = window.location.href
                    .replace(window.location.search, '')
                    .replace(pathname, '${appBaseName}')
                  console.log(nextPathName)
                  window.location.href = nextPathName
                } else {
                  const nextPathName = window.location.href
                    .replace(window.location.search, '')
                    .replace(pathname, matchRoute)
                  const storePathName = window.location.href.replace()
                  sessionStorage.setItem('redirectPath', pathname + window.location.search)
                  window.location.href = nextPathName
                }
              </script>
            `
            if (entryName === 'index.html') {
              fs.writeFileSync('dist/404.html', file404, 'utf-8')
            } else {
              fs.mkdirSync(`dist/${entryName}`)
              fs.writeFileSync(`dist/${entryName}/404.html`, file404, 'utf-8')
            }

            return 'assets/[name]-[hash].js'
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
