import * as React from 'react'
import ReactDOM from 'react-dom/client'
import { Outlet } from 'react-router-dom'
import {
  flow, keys
} from 'lodash-es'
import Root from '../components/Root'
import PortalWithLinks from '../components/Portal/WithLinks'
import Router from '../components/Router'
import getRoutes from '../components/Router/getRoutes'

const links = flow(
  () => keys(import.meta.glob('./*/index.jsx')),
  (paths) => paths.filter((path) => {
    return (
      // login 只有在 mock 環境露出
      (window.IS_MOCK ? true : !path.includes('./login'))
    )
  }),
  (filteredPaths) => filteredPaths.map((path) => {
    if (window.APP_BASENAME === '') {
      return path.replace('index.jsx', '')
    }

    return path.replace('./', '/').replace('index.jsx', '')
  }),
  (endpoints) => endpoints.map((endpoint) => {
    const path = endpoint.replace(/\.\/|\//g, '')
    return {
      url: `/${path}`,
      name: path
    }
  })
)()

const pages = import.meta.glob('./**/pages/**/index.jsx')
const loaders = import.meta.glob('./**/pages/**/index.loader.js')
const dynamicRoutes = [
  {
    path: '/',
    element: () => <PortalWithLinks links={links} />
  },
  ...getRoutes(pages, loaders, true)
]

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router
      routes={dynamicRoutes}
      layout={() => (
        <Root>
          <Outlet />
        </Root>
      )}
    />
  </React.StrictMode>
)
