import { Outlet } from 'react-router-dom'
import NavBar from '../NavBar'
import Drawer from '../Drawer'

const Layout = () => (
  <>
    <NavBar />
    <Drawer>
      <div className='max-lg:m-auto max-lg:max-w-2xl max-sm:min-w-full max-sm:p-4 sm:p-12 lg:max-w-5xl'>
        <Outlet />
      </div>
    </Drawer>
  </>
)

export default Layout
