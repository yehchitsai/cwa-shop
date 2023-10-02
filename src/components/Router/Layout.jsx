import { Outlet } from 'react-router-dom'
import NavBar from '../NavBar'

const Layout = () => (
  <>
    <NavBar />
    <div className='w-full max-w-full'>
      <Outlet />
    </div>
  </>
)

export default Layout
