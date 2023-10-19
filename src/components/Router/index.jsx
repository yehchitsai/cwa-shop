import { Suspense } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  redirect
} from 'react-router-dom'
import { isEmpty } from 'lodash-es'
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
      loader: () => {
        const redirectPath = window.sessionStorage.getItem('redirectPath')
        if (!isEmpty(redirectPath) && redirectPath !== '111') {
          window.sessionStorage.removeItem('redirectPath')
          const nextPath = redirectPath.replace(window.location.pathname, '')
          return redirect(nextPath.startsWith('/') ? nextPath : `/${nextPath}`)
        }
        return null
      },
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
