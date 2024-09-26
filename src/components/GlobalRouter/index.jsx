import Router from '../Router'
import Layout from './Layout'

const GlobalRouter = (props) => {
  const { routes } = props

  return (
    <Router
      routes={routes}
      layout={Layout}
      isRootRoutes
    />
  )
}

export default GlobalRouter
