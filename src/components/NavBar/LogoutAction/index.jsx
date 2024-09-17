import { MdLogout } from 'react-icons/md'
import { useLocation } from 'react-router-dom'
import getLoginLogoutUrl from '../../../utils/getLoginLogoutUrl'

const LogoutAction = () => {
  const location = useLocation()
  const { loginUrl, logoutUrl } = getLoginLogoutUrl(location)
  return (
    <a
      href={window.IS_MOCK ? `${window.location.origin}${window.APP_BASENAME}/${loginUrl}` : logoutUrl}
      className='btn btn-ghost'
    >
      <MdLogout size='1.5em' />
    </a>
  )
}

export default LogoutAction
