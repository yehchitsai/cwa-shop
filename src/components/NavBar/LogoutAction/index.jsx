import { MdLogout } from 'react-icons/md'
import getLoginLogoutUrl from '../../../utils/getLoginLogoutUrl'

const { loginUrl, logoutUrl } = getLoginLogoutUrl()

const LogoutAction = () => {
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
