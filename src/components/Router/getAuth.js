import { redirect } from 'react-router-dom'
import { preload } from 'swr'
import fetcher from '../../utils/fetcher'
import getEnvVar from '../../utils/getEnvVar'
import getLoginLogoutUrl from '../../utils/getLoginLogoutUrl'
import getApiPrefix from '../../utils/getApiPrefix'
import clearExpiredLoginToken from '../../utils/clearExpiredLoginToken'

const { loginUrl, logoutUrl } = getLoginLogoutUrl()
const host = getEnvVar('VITE_AWS_CHECK_AUTHORIZE')

const getRedirectResp = () => {
  if (window.IS_MOCK) {
    return redirect(`${window.location.origin}${window.APP_BASENAME}/${loginUrl}`)
  }

  return redirect(logoutUrl)
}

const getAuth = (subPrefix) => {
  const awsHostPrefix = getApiPrefix(subPrefix)
  const authConfig = {
    host,
    url: `${awsHostPrefix}/checkAuthorize`,
    options: {
      errorMessage: '未登入'
    }
  }
  return preload(authConfig, fetcher)
    .then((res) => {
      if (res.message === 'Unauthorized') {
        return [res.message, null, getRedirectResp()]
      }
      clearExpiredLoginToken()
      return [null, res.message]
    })
    .catch((e) => {
      console.log(e)
      return [e, null, getRedirectResp()]
    })
}

export default getAuth
