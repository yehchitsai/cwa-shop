import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import clx from 'classnames'
import Logo from './Logo'
import LangsAction from './LangsAction'
import LogoutAction from './LogoutAction'
import UserAction from './UserAction'
import PurchaseAction from './PurchaseAction'
import getEntry from '../../utils/getEntry'

const NAV_BAR_TYPE = {
  SHOP: 'shop',
  PURCHASE: 'purchase',
  STAFF: 'staff'
}

const useNavBarType = () => {
  const location = useLocation()
  const { isShop, isPurchase, isStaff } = getEntry(location)

  let navBarType
  switch (true) {
    case isPurchase: {
      navBarType = NAV_BAR_TYPE.PURCHASE
      break
    }
    case isStaff: {
      navBarType = NAV_BAR_TYPE.STAFF
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

  if (navBarType === NAV_BAR_TYPE.STAFF) {
    return (
      <>
        <LangsAction />
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
  const { isDev } = getEntry(location)
  const isHiddenNavBar = isDev && location.pathname === '/'

  if (isHiddenNavBar) {
    return null
  }

  const LOGO_TITLE = {
    [NAV_BAR_TYPE.SHOP]: t('shopLogoTitle'),
    [NAV_BAR_TYPE.PURCHASE]: t('purchaseLogoTitle'),
    [NAV_BAR_TYPE.STAFF]: t('purchaseLogoTitle')
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
