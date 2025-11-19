import axios from 'axios'
import { get, isEmpty, isString } from 'lodash-es'
import mockFetcher from './mockFetcher'
import getSearchValuesFromUrl from './getSearchValuesFromUrl'
import cookiejs from './cookies'

const axiosInstance = axios.create({})

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
    window.location.hash.replace(/\?to.*/, '').replace('#', '?')
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
  const {
    arg: {
      host: hostFromTrigger,
      url: keyFromTrigger = '',
      isJsonResponse = true,
      isAuthHeader = true,
      customHeaders = {},
      body: data
    } = {}
  } = triggerArgs
  const {
    host: hostFromHook = '',
    url: keyFromGet = '',
    options = {}
  } = config
  const host = hostFromTrigger || hostFromHook
  const { header = {}, errorMessage = '發生錯誤', ...restOptions } = options
  const key = keyFromGet || keyFromTrigger
  const url = hostFromTrigger ? host : `${host}${key}`
  const isHttpRequest = host.startsWith('http')
  const isAwsApi = key.startsWith(window.AWS_HOST_PREFIX)
  // delay for multiple tab login with different user
  // when tab change will trigger set last login user token into cookie
  const authorization = await new Promise((resolve) => {
    setTimeout(() => resolve(getAuthorization()), 10)
  })
  const { method, ...newOptions } = {
    headers: {
      ...customHeaders,
      ...(isAuthHeader ? authorization : {}),
      ...header
    },
    ...restOptions
  }
  const isGetRequest = isEmpty(method)
  const request = !isForceDisableMock && (
    window.IS_MOCK &&
    window.IS_MOCK_AWS_API &&
    !isHttpRequest &&
    isAwsApi
  )
    ? Promise.reject(new Error('Skip no http aws api request'))
    : isGetRequest
      ? axiosInstance.get(url, newOptions)
      : axiosInstance[method](url, data, newOptions)
  return request
    .then(async (res) => {
      if (window.IS_MOCK && isString(res.data) && res.data.startsWith('<!doctype html>')) {
        throw new Error('Endpoint not found.')
      }
      if (isJsonResponse) {
        const isFail = get(res, 'data.status') === 'fail'
        const failMessage = get(res, 'data.results.message')
        if (isFail && failMessage) {
          throw new Error(failMessage, { cause: res.data })
        }
        return res.data
      }
      return res
    })
    .catch((e) => {
      // const cause = get(e, 'cause')
      // if (cause) {
      //   throw new Error(e)
      // }
      const isMockAwsApi = (window.IS_MOCK_AWS_API && key.startsWith(window.AWS_HOST_PREFIX))
      if ((!window.IS_MOCK && !isMockAwsApi) || isForceDisableMock) {
        console.log(e)
        throw new Error(errorMessage)
      }

      forceDebug && console.log(
        'Fetch data failed, mock mode will will using mock data instead.',
        { url, options, error: e.toString() }
      )
      const optionsForMock = {
        method,
        data,
        ...newOptions
      }
      return mockFetcher(key, authorization, optionsForMock)
    })
}

export default fetcher
