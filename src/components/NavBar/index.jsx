import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import clx from 'classnames'
import Logo from './Logo'
import LangsAction from './LangsAction'
import LogoutAction from './LogoutAction'
import UserAction from './UserAction'
import PurchaseAction from './PurchaseAction'

const isDev = window.ENTRY_PATH === '/'
const shopPaths = ['/external', '/external-demo', '/internal', '/demo']
const purchasePaths = ['/purchase-domestic', '/purchase-export']

const NAV_BAR_TYPE = {
  SHOP: 'shop',
  PURCHASE: 'purchase'
}

const useNavBarType = () => {
  const location = useLocation()
  const [isShop, isPurchase] = [shopPaths, purchasePaths].map((targetPaths) => {
    return (
      (isDev && targetPaths.some((shopPath) => location.pathname.startsWith(shopPath))) ||
      (!isDev && targetPaths.includes(window.ENTRY_PATH))
    )
  })

  let navBarType
  switch (true) {
    case isPurchase: {
      navBarType = NAV_BAR_TYPE.PURCHASE
      break
    }
    case isShop:
    default: {
      navBarType = NAV_BAR_TYPE.SHOP
      break
    }
  }
  return navBarType
}

const NavBarActions = (props) => {
  const { fixed } = props
  const navBarType = useNavBarType()

  if (navBarType === NAV_BAR_TYPE.SHOP) {
    return (
      <>
        <LangsAction />
        <UserAction fixed={fixed} />
        <LogoutAction />
      </>
    )
  }

  if (navBarType === NAV_BAR_TYPE.PURCHASE) {
    return (
      <>
        <LangsAction />
        <PurchaseAction />
        <LogoutAction />
      </>
    )
  }

  return null
}

const NavBar = (props) => {
  const { fixed, appBaseName } = props
  const { t } = useTranslation()
  const location = useLocation()
  const navBarType = useNavBarType()
  const isHiddenNavBar = isDev && location.pathname === '/'

  if (isHiddenNavBar) {
    return null
  }

  const LOGO_TITLE = {
    [NAV_BAR_TYPE.SHOP]: t('shopLogoTitle'),
    [NAV_BAR_TYPE.PURCHASE]: t('purchaseLogoTitle')
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
        <Logo appBaseName={appBaseName}>
          {LOGO_TITLE[navBarType]}
        </Logo>
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
