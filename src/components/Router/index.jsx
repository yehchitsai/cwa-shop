import { Suspense } from 'react'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import SkeletonHome from '../Skeleton/Home'
import ErrorElement from './ErrorElement.jsx'
import Layout from './Layout'
import NavBar from '../NavBar'
import 'react-loading-skeleton/dist/skeleton.css'

const withErrorElement = (routes) => routes.map((item) => {
  const {
    children, element: Comp, ...route
  } = item
  return {
    ...route,
    element: <Comp />,
    errorElement: <ErrorElement />
  }
})

const Router = (props) => {
  const { routes, basename = '/' } = props
  const totalRoutes = [
    {
      element: <Layout />,
      children: withErrorElement([
        ...routes,
        {
          path: '/test',
          element: SkeletonHome
        }
      ])
    }
  ]
  console.log(totalRoutes, `${window.APP_BASENAME}${basename}`)
  const router = createBrowserRouter(totalRoutes, { basename: `${window.APP_BASENAME}${basename}` })
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
