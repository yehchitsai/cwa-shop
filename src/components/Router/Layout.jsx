import { Outlet } from 'react-router-dom'
import NavBar from '../NavBar'

const Layout = (props) => {
  const { appBaseName } = props
  return (
    <>
      <NavBar appBaseName={appBaseName} />
      <div className='w-full max-w-full'>
        <Outlet />
      </div>
    </>
  )
}

export default Layout
