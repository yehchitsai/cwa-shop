import { Suspense } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  defer
} from 'react-router-dom'
import SkeletonHome from '../Skeleton/Home'
import ErrorElement from './ErrorElement'
import Layout from './Layout'
import NavBar from '../NavBar'
import getAuth from './getAuth'
import 'react-loading-skeleton/dist/skeleton.css'

const withErrorElement = (routes) => routes.map((item) => {
  const {
    element: Comp, ...route
  } = item
  return {
    ...route,
    element: <Comp />,
    errorElement: <ErrorElement />
  }
})

const defaultAuth = { message: 'NO USER' }

const Router = (props) => {
  const { routes, basename = '/', isAuthRoutes = true } = props
  const appBaseName = `${window.APP_BASENAME}${basename}`
  const totalRoutes = [
    {
      element: <Layout appBaseName={appBaseName} />,
      loader: async ({ request }) => {
        const { pathname } = new URL(request.url)
        const expectedAuthRoutes = [
          'external'
        ].some((authRoute) => pathname.startsWith(`/${authRoute}`))
        if (!isAuthRoutes && !expectedAuthRoutes) {
          return defaultAuth
        }

        const [error, auth, response] = await getAuth()
        if (error) {
          throw response
        }
        return defer({ message: auth })
      },
      children: withErrorElement([
        ...routes,
        {
          path: '/test',
          element: SkeletonHome
        },
        {
          path: '/*',
          element: ErrorElement
        }
      ])
    }
  ]
  // console.log(totalRoutes, appBaseName)
  const router = createBrowserRouter(totalRoutes, { basename: appBaseName })
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
