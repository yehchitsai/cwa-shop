import { redirect } from 'react-router-dom'
import { preload } from 'swr'
import fetcher from '../../utils/fetcher'
import getEnvVar from '../../utils/getEnvVar'
import getLoginLogoutUrl from '../../utils/getLoginLogoutUrl'
import getApiPrefix from '../../utils/getApiPrefix'
import getEntry from '../../utils/getEntry'

const { loginUrl, logoutUrl } = getLoginLogoutUrl()
const host = getEnvVar('VITE_AWS_CHECK_AUTHORIZE')

const getRedirectResp = () => {
  if (window.IS_MOCK) {
    return redirect(`${window.location.origin}${window.APP_BASENAME}/${loginUrl}`)
  }

  return redirect(logoutUrl)
}

const getAuth = () => {
  const { isShop, isPurchase, isStaff } = getEntry()
  let subPrefix
  switch (true) {
    case isStaff:
    case isPurchase: {
      subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
      break
    }
    case isShop:
    default: {
      subPrefix = getEnvVar('VITE_AWS_SHOP_HOST_PREFIX')
      break
    }
  }
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
      return [null, res.message]
    })
    .catch((e) => {
      console.log(e)
      return [e, null, getRedirectResp()]
    })
}

export default getAuth
