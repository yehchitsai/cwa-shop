import { Outlet } from 'react-router-dom'
import Root from '../../../components/Root'

const SiteLayout = () => {
  return (
    <Root>
      <div className='w-full max-w-full'>
        <Outlet />
      </div>
    </Root>
  )
}

export default SiteLayout
