import ReactDOM from 'react-dom/client'
import getRouterBase from '../../utils/getRouterBase'
import Router from '../../components/Router'
import getRoutes from '../../components/Router/getRoutes'
import Root from '../../components/Root'

const pages = import.meta.glob('./pages/**/index.jsx')
const dynamicRoutes = getRoutes(pages)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Root>
    <Router
      routes={dynamicRoutes}
      basename={getRouterBase('/demo')}
      isAuthRoutes={false}
    />
  </Root>
)
