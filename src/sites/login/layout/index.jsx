import { Outlet } from 'react-router-dom'
import Root from '../../../components/Root'
import NavBar from '../../../components/NavBar'

const SiteLayout = (props) => {
  const { appBaseName } = props
  return (
    <Root>
      <NavBar
        appBaseName={appBaseName}
        title='Example'
      />
      <div className='w-full max-w-full'>
        <Outlet />
      </div>
    </Root>
  )
}

export default SiteLayout
