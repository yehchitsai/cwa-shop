import { Suspense, lazy } from 'react'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import { flow, isEmpty } from 'lodash-es'
import SkeletonHome from '../Skeleton/Home'
import ErrorElement from './ErrorElement.jsx'
import Layout from './Layout'
import NavBar from '../NavBar'
import 'react-loading-skeleton/dist/skeleton.css'

const pages = import.meta.glob('../../pages/**/*.jsx')

const dynamicRoutes = flow(
  () => Object.entries(pages),
  (pagesEntries) => pagesEntries.reduce((collect, pagesEntry) => {
    const [path, page] = pagesEntry
    const fileName = path.match(/\.\/pages\/(.*)\.jsx$/)?.[1]
    if (!fileName) {
      return collect
    }

    const normalizedPathName = fileName.includes('$')
      ? fileName.replace('$', ':')
      : fileName.replace(/\/index/, '')

    const Component = lazy(page)
    collect.push({
      path: fileName === 'index' ? '/' : `/${normalizedPathName.toLowerCase()}`,
      element: <Component />
    })
    return collect
  }, [])
)()

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
          <SkeletonHome className='fixed top-0 z-0' />
        </>
      )}
    >
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default Router
