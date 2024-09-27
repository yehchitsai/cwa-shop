import { useLocation } from '@react-hooks-library/core'
import { get } from 'lodash-es'
import Router from '../Router'
import Layout from './Layout'

const loaders = import.meta.glob('../../sites/**/layout/index.loader.js', { eager: true })

const GlobalRouter = (props) => {
  const { routes } = props
  const location = useLocation()

  const rootPathname = get(location, 'pathname', '/').split('/')[1]
  const loader = get(loaders, [`../../sites/${rootPathname}/layout/index.loader.js`, 'default'])
  return (
    <Router
      routes={routes}
      layout={Layout}
      loader={loader}
      isRootRoutes
    />
  )
}

export default GlobalRouter
