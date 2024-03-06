import { get, isEmpty } from 'lodash-es'
import mockFetcher from './mockFetcher'
import getSearchValuesFromUrl from './getSearchValuesFromUrl'
import cookiejs from './cookies'

export const TOKEN_KEY = {
  TOKEN_TYPE: 'token_type',
  ACCESS_TOKEN: 'access_token'
}

let TMP_TOKEN = {}

const TOKEN_KEYS = [TOKEN_KEY.TOKEN_TYPE, TOKEN_KEY.ACCESS_TOKEN]

export const removeTokens = () => {
  TOKEN_KEYS.map((key) => cookiejs.remove(key))
}

export const clearTmpToken = () => {
  TMP_TOKEN = {}
}

const getAuthorization = () => {
  let Authorization = {}
  const [
    tokenTypeFromCookie, accessTokenFromCookie
  ] = TOKEN_KEYS.map((key) => cookiejs.get(key))
  const [tokenTypeFromUrl, accessTokenFromUrl] = getSearchValuesFromUrl(
    TOKEN_KEYS,
    window.location.hash.replace('#', '?')
  )
  const isTempTokenExist = !isEmpty(TMP_TOKEN)
  const isCookieTokenExist = !!(tokenTypeFromCookie && accessTokenFromCookie)
  const isUrlSearchTokenExist = !!(tokenTypeFromUrl && accessTokenFromUrl)
  // always remove cookie token first
  removeTokens()
  // find user priority hash token > tmp variable token > storage token
  switch (true) {
    case isUrlSearchTokenExist: {
      Authorization = {
        [TOKEN_KEY.TOKEN_TYPE]: tokenTypeFromUrl,
        [TOKEN_KEY.ACCESS_TOKEN]: accessTokenFromUrl
      }
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
      break
    }
    case isTempTokenExist: {
      Authorization = TMP_TOKEN
      break
    }
    case isCookieTokenExist: {
      Authorization = {
        [TOKEN_KEY.TOKEN_TYPE]: tokenTypeFromCookie,
        [TOKEN_KEY.ACCESS_TOKEN]: accessTokenFromCookie
      }
      break
    }
    default:
      break
  }

  if (isEmpty(Authorization)) {
    return {}
  }

  TMP_TOKEN = Authorization
  return {
    Authorization: `${Authorization[TOKEN_KEY.TOKEN_TYPE]} ${Authorization[TOKEN_KEY.ACCESS_TOKEN]}`
  }
}

const beforeUnloadHandler = () => {
  if (!isEmpty(TMP_TOKEN)) {
    TOKEN_KEYS.map((key) => cookiejs.set(key, TMP_TOKEN[key]))
  }
}
window.addEventListener('visibilitychange', (event) => {
  const visibilityState = get(event, 'target.visibilityState', 'visible')
  if (visibilityState === 'hidden') {
    beforeUnloadHandler()
  } else {
    removeTokens()
  }
})
window.addEventListener('beforeunload', beforeUnloadHandler)

const fetcher = async (config = {}, triggerArgs = {}) => {
  const [forceMock, forceDebug] = getSearchValuesFromUrl(['MOCK', 'DEBUG'])
  const isForceDisableMock = forceMock === '0'
  const { arg: { url: keyFromTrigger = '', ...body } = {} } = triggerArgs
  const { host = '', url: keyFromGet = '', options = {} } = config
  const { header = {}, errorMessage = '發生錯誤', ...restOptions } = options
  const key = keyFromGet || keyFromTrigger
  const url = `${host}${key}`
  const isHttpRequest = host.startsWith('http')
  const isAwsApi = key.startsWith(window.AWS_HOST_PREFIX)
  const isGetRequest = isEmpty(body)
  // delay for multiple tab login with different user
  // when tab change will trigger set last login user token into cookie
  const authorization = await new Promise((resolve) => {
    setTimeout(() => resolve(getAuthorization()), 10)
  })
  const newOptions = {
    headers: new Headers({
      'Content-type': 'application/json',
      ...authorization,
      ...header
    }),
    ...(!isGetRequest && { body: JSON.stringify(body) }),
    ...restOptions
  }
  const request = !isForceDisableMock && (
    window.IS_MOCK &&
    window.IS_MOCK_AWS_API &&
    !isHttpRequest &&
    isAwsApi
  )
    ? Promise.reject(new Error('Skip no http aws api request'))
    : fetch(url, newOptions)
  return request
    .then(async (res) => {
      if (!res.ok) {
        const error = new Error('An error occurred while fetching the data.')
        error.info = await res.json()
        error.status = res.status
        throw error
      }
      return res.json()
    })
    .catch((e) => {
      const isMockAwsApi = (window.IS_MOCK_AWS_API && key.startsWith(window.AWS_HOST_PREFIX))
      if (!window.IS_MOCK && !isMockAwsApi) {
        console.log(e)
        throw new Error(errorMessage)
      }

      forceDebug && console.log(
        'Fetch data failed, mock mode will will using mock data instead.',
        { url, options, error: e.toString() }
      )
      return mockFetcher(key, authorization, newOptions)
    })
}

export default fetcher
