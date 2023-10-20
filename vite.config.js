import fs from 'fs'
import { resolve } from 'path'
import { defineConfig, splitVendorChunkPlugin, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { viteMockServe } from 'vite-plugin-mock'
import { sync } from 'glob'
import {
  flow, isEmpty, orderBy, size, uniq
} from 'lodash-es'
import { version, name } from './package.json'

const appBaseName = process.env.BASENAME ? `/${name}` : ''
const outDir = resolve(__dirname, 'dist')
const envDir = resolve(__dirname, 'environments')
const entries = sync('src/sites/**/index.html')
const entriesMap = Object.fromEntries(
  entries.map((entry) => {
    return [entry.replace('src/sites/', '').replace('/index.html', ''), entry]
  })
)
const rootRoutesMap = Object.fromEntries(
  entries.map((entry) => {
    return [entry.replace('src/sites', '').replace('index.html', ''), entry]
  })
)
const routes = flow(
  () => sync('src/sites/**/index.jsx').reduce((collect, file) => {
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
  const isMock = !!process.env.MOCK
  const isMockAwsApi = !!process.env.MOCK_AWS_API
  const modeEnv = loadEnv(isMock ? 'mock' : mode, envDir)
  process.env = { ...process.env, ...modeEnv }
  const viteConfig = {
    base: './',
    envDir,
    define: {
      'window.APP_VERSION': `"${version}"`,
      'window.APP_BASENAME': `"${appBaseName}"`,
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
                console.log(pathname, isRouteExist, matchRoute)
                if (!isRouteExist) {
                  window.location.href = window.location.href.replace(pathname, '/${isEmpty(name) ? '' : `${name}/`}')
                }

                sessionStorage.setItem('redirectPath', isFolderPath ? pathname.slice(0, -1) : pathname)
                window.location.href = window.location.href.replace(pathname, matchRoute)
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
