import { Outlet } from 'react-router-dom'
import { RiBillLine } from 'react-icons/ri'
import i18n from '../../../i18n'
import Root from '../../../components/Root'
import NavBar from '../../../components/NavBar'
import LangsAction from '../../../components/NavBar/LangsAction'
import PurchaseAction from '../../../components/NavBar/PurchaseAction'
import LogoutAction from '../../../components/NavBar/LogoutAction'

const ExternalLink = () => {
  return (
    <a
      className='btn btn-ghost'
      href='https://quotation.uniheart.com.tw/'
    >
      <div
        className='tooltip tooltip-bottom'
        data-tip='鬥魚系統'
      >
        <RiBillLine size='1.5em' />
      </div>
    </a>
  )
}

const SiteLayout = (props) => {
  const { appBaseName } = props
  return (
    <Root>
      <NavBar
        appBaseName={appBaseName}
        title={i18n.t('purchaseLogoTitle')}
        actions={(
          <>
            <ExternalLink />
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
