import { get } from 'lodash-es'
import Router from '../Router'
import Layout from './Layout'

const loaders = import.meta.glob('../../sites/**/layout/index.loader.js', { eager: true })

const loader = async (arg) => {
  const { request } = arg
  const { pathname } = new URL(request.url)
  const rootPathname = pathname.split('/')[1]
  const rootLoader = get(loaders, [`../../sites/${rootPathname}/layout/index.loader.js`, 'default'])
  if (!rootLoader) {
    return {}
  }

  return rootLoader(arg)
}

const GlobalRouter = (props) => {
  const { routes } = props
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
