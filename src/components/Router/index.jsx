import { Suspense, lazy } from 'react'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import { isEmpty } from 'lodash-es'
import SkeletonHome from '../Skeleton/Home'
import ErrorElement from './ErrorElement.jsx'
import Layout from './Layout'
import NavBar from '../NavBar'

const pages = import.meta.glob('../../pages/*.jsx')

const dynamicRoutes = Object.entries(pages).map(([path, page]) => {
  const componentName = path.split('/').pop().replace(/.jsx$/, '')
  const routePath = componentName === 'Home' ? '/' : `/${componentName.toLowerCase()}`
  const Component = lazy(page)
  return {
    path: routePath,
    element: <Component />
  }
})

const withErrorElement = (routes) => routes.map(({ children, ...route }) => (
  {
    ...route,
    ...(!isEmpty(children) && { children: withErrorElement(children) }),
    errorElement: <ErrorElement />
  }
))

const routes = [
  {
    element: <Layout />,
    children: withErrorElement([
      ...dynamicRoutes,
      {
        path: '/test',
        element: <SkeletonHome />
      }
    ])
  }
]

const Router = () => {
  const router = createBrowserRouter(routes, { basename: window.APP_BASENAME })
  return (
    <Suspense
      fallback={(
        <>
          <NavBar fixed />
          <SkeletonHome />
        </>
      )}
    >
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default Router
