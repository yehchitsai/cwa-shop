import { Outlet, useLocation } from 'react-router-dom'

const layouts = import.meta.glob('../../../sites/**/layout/index.jsx')
// const loaders = import.meta.glob('../sites/**/layout/index.loader.js')
console.log(layouts)

const Layout = () => {
  const location = useLocation()
  console.log(location.pathname)
  return (
    <Outlet />
  )
}

export default Layout
