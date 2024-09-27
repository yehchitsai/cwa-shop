import { Outlet, useLocation } from 'react-router-dom'
import { get } from 'lodash-es'

const layouts = import.meta.glob('../../../sites/**/layout/index.jsx', { eager: true })

const Layout = (props) => {
  const { pathname } = useLocation()
  if (pathname === '/') {
    return (
      <Outlet />
    )
  }
  const rootPathname = pathname.split('/')[1]
  const Component = get(layouts, [`../../../sites/${rootPathname}/layout/index.jsx`, 'default'], Outlet)
  return (
    <Component {...props} />
  )
}

export default Layout
