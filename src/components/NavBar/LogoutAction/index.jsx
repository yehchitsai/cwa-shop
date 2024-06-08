import { MdLogout } from 'react-icons/md'

const loginUrl = import.meta.env.VITE_LOGIN_URL
const logoutUrl = import.meta.env.VITE_LOGOUT_URL

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
