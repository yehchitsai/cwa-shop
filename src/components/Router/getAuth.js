import { redirect } from 'react-router-dom'
import { preload } from 'swr'
import fetcher from '../../utils/fetcher'
import getApiHost from '../../utils/getApiHost'
import getLoginLogoutUrl from '../../utils/getLoginLogoutUrl'

const { loginUrl, logoutUrl } = getLoginLogoutUrl()
const host = getApiHost('VITE_AWS_CHECK_AUTHORIZE')
const awsHostPrefix = import.meta.env.VITE_AWS_HOST_PREFIX
const authConfig = {
  host,
  url: `${awsHostPrefix}/checkAuthorize`,
  options: {
    errorMessage: '未登入'
  }
}

const getRedirectResp = () => {
  if (window.IS_MOCK) {
    return redirect(`${window.location.origin}${window.APP_BASENAME}/${loginUrl}`)
  }

  return redirect(logoutUrl)
}

const getAuth = () => preload(authConfig, fetcher)
  .then((res) => {
    if (res.message === 'Unauthorized') {
      return [res.message, null, getRedirectResp()]
    }
    return [null, res.message]
  })
  .catch((e) => {
    console.log(e)
    return [e, null, getRedirectResp()]
  })

export default getAuth
