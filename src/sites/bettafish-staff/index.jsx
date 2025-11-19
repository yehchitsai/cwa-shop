import * as React from 'react'
import ReactDOM from 'react-dom/client'
import getRouterBase from '../../utils/getRouterBase'
import Router from '../../components/Router'
import getRoutes from '../../components/Router/getRoutes'
import SiteLayout from './layout'
import loader from './layout/index.loader'

const pages = import.meta.glob('./pages/**/index.jsx')
const loaders = import.meta.glob('./pages/**/index.loader.js')
const dynamicRoutes = getRoutes(pages, loaders)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router
      routes={dynamicRoutes}
      basename={getRouterBase('/bettafish-staff')}
      layout={SiteLayout}
      loader={loader}
    />
  </React.StrictMode>
)
