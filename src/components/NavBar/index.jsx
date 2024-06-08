import { useLocation } from 'react-router-dom'
import clx from 'classnames'
import Logo from './Logo'
import LangsAction from './LangsAction'
import LogoutAction from './LogoutAction'
import UserAction from './UserAction'

const isDev = window.ENTRY_PATH === '/'
const shopPaths = ['/external', '/internal', '/demo']

const NavBarActions = (props) => {
  const { fixed } = props
  const location = useLocation()
  const isShop = (
    (isDev && shopPaths.some((shopPath) => location.pathname.startsWith(shopPath))) ||
    (!isDev && shopPaths.includes(window.ENTRY_PATH))
  )

  if (isShop) {
    return (
      <>
        <LangsAction />
        <UserAction fixed={fixed} />
        <LogoutAction />
      </>
    )
  }

  return null
}

const NavBar = (props) => {
  const { fixed, appBaseName } = props
  const location = useLocation()
  const isHiddenNavBar = isDev && location.pathname === '/'

  if (isHiddenNavBar) {
    return null
  }

  return (
    <div
      className={clx(
        'navbar bg-base-300 w-full top-0 z-10',
        'sticky',
        { fixed }
      )}
    >
      <div className='flex-1'>
        <Logo appBaseName={appBaseName} />
      </div>
      <div className='flex flex-1 justify-end'>
        <div className='flex items-stretch'>
          <NavBarActions
            fixed={fixed}
          />
        </div>
      </div>
    </div>
  )
}

export default NavBar
