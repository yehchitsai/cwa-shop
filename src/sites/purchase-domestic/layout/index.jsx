import { Outlet } from 'react-router-dom'
import i18n from '../../../i18n'
import Root from '../../../components/Root'
import NavBar from '../../../components/NavBar'
import LangsAction from '../../../components/NavBar/LangsAction'
import PurchaseAction from '../../../components/NavBar/PurchaseAction'
import LogoutAction from '../../../components/NavBar/LogoutAction'

const SiteLayout = (props) => {
  const { appBaseName } = props
  return (
    <Root>
      <NavBar
        appBaseName={appBaseName}
        title={i18n.t('purchaseLogoTitle')}
        actions={(
          <>
            <LangsAction />
            <PurchaseAction />
            <LogoutAction />
          </>
        )}
      />
      <div className='w-full max-w-full'>
        <Outlet />
      </div>
    </Root>
  )
}

export default SiteLayout
