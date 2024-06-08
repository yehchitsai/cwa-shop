import { useLocation } from 'react-router-dom'
import clx from 'classnames'
import Logo from './Logo'
import LangsAction from './LangsAction'
import LogoutAction from './LogoutAction'
import UserAction from './UserAction'
import OrderAction from './OrderAction'

const isDev = window.ENTRY_PATH === '/'
const shopPaths = ['/external', '/internal', '/demo']
const orderPaths = ['/order-domestic', '/order-export']

const NavBarActions = (props) => {
  const { fixed } = props
  const location = useLocation()
  const [isShop, isOrder] = [shopPaths, orderPaths].map((targetPaths) => {
    return (
      (isDev && targetPaths.some((shopPath) => location.pathname.startsWith(shopPath))) ||
      (!isDev && targetPaths.includes(window.ENTRY_PATH))
    )
  })

  if (isShop) {
    return (
      <>
        <LangsAction />
        <UserAction fixed={fixed} />
        <LogoutAction />
      </>
    )
  }

  if (isOrder) {
    return (
      <>
        <LangsAction />
        <OrderAction />
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
