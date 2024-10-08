import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { viteMockServe } from 'vite-plugin-mock'
import { analyzer } from 'vite-bundle-analyzer'
import { sync } from 'glob'
import {
  pick
} from 'lodash-es'
import { version, name } from './package.json'

const DEFAULT_ENTRY = '__index'
const {
  NODE_ENV,
  BASENAME,
  PREVIEW,
  ANALYZER,
  MOCK,
  MOCK_AWS_API,
  ENTRY = DEFAULT_ENTRY
} = process.env
const isMock = !!MOCK
const isMockAwsApi = !!MOCK_AWS_API
const isPreview = !!PREVIEW
const isAnalyzer = !!ANALYZER
const isDefaultEntry = ENTRY === DEFAULT_ENTRY
const isGhPage = BASENAME === '1'
const appBaseName = (BASENAME && !isPreview) ? `/${name}` : ''

const defaultOutDir = 'dist'
const outDir = resolve(__dirname, defaultOutDir)
const envDir = resolve(__dirname, 'environments')
const entriesDir = 'src/sites'
const entries = sync(`${entriesDir}/**/index.html`)
const entriesMap = pick(
  Object.fromEntries(
    entries.map((entry) => {
      const key = entry
        .replace(`${entriesDir}/`, '')
        .replace('/index.html', '')
        .replace('index.html', DEFAULT_ENTRY)
      return [key, entry]
    })
  ),
  [ENTRY]
)

if (!isDefaultEntry) {
  console.log(`Build entry: ${entriesDir}/${ENTRY}`)
}

// https://vitejs.dev/config/
export default ({ mode }) => {
  const isProd = NODE_ENV === 'production'
  const modeEnv = loadEnv(isMock ? 'mock' : mode, envDir)
  const targetEnv = loadEnv(isProd ? 'production' : 'development', envDir)
  const awsHostPrefix = modeEnv.VITE_AWS_HOST_PREFIX
  process.env = { ...process.env, ...modeEnv }

  const viteConfig = defineConfig({
    base: isProd
      ? BASENAME ? appBaseName : undefined
      : './',
    envDir,
    define: {
      'window.APP_VERSION': `"${version}"`,
      'window.APP_BASENAME': `"${appBaseName}"`,
      'window.AWS_HOST_PREFIX': `"${awsHostPrefix}"`,
      'window.IS_MOCK': `${isMock}`,
      'window.IS_MOCK_AWS_API': `${isMockAwsApi}`,
      'window.IS_PROD': `${isProd}`,
      'window.IS_PREVIEW': `${isPreview}`,
      'window.IS_GH_PAGE': `${isGhPage}`,
      'window.TARGET_ENV': `${JSON.stringify(targetEnv)}`,
      'window.CURRENT_ENV': `${JSON.stringify(modeEnv)}`,
      'window.ENTRY_PATH': `"/${isDefaultEntry ? '' : ENTRY}"`
    },
    root: `${entriesDir}/${isDefaultEntry ? '' : `/${ENTRY}`}`,
    plugins: [
      react(),
      viteMockServe({
        mockPath: './src/mock',
        localEnabled: isMock
      }),
      ...(isAnalyzer ? [analyzer()] : [])
    ],
    build: {
      outDir: isDefaultEntry ? outDir : resolve(__dirname, `${defaultOutDir}/${ENTRY}`),
      emptyOutDir: true,
      rollupOptions: {
        input: entriesMap
      }
    },
    server: {
      proxy: {
        [awsHostPrefix]: {
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(new RegExp(`^${awsHostPrefix}`), '')
        }
      }
    }
  })
  return viteConfig
}
