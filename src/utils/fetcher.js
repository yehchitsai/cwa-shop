import { isEmpty } from 'lodash-es'
import mockFetcher from './mockFetcher'
import getSearchValuesFromUrl from './getSearchValuesFromUrl'

const TOKEN_KEY = {
  TOKEN_TYPE: 'token_type',
  ACCESS_TOKEN: 'access_token'
}

let TMP_TOKEN = {}

const TOKEN_KEYS = [TOKEN_KEY.TOKEN_TYPE, TOKEN_KEY.ACCESS_TOKEN]

const getAuthorization = () => {
  let Authorization = {}
  const [
    tokenTypeFromStorage, accessTokenFromStorage
  ] = TOKEN_KEYS.map((key) => window.localStorage.getItem(key))
  const [tokenTypeFromUrl, accessTokenFromUrl] = getSearchValuesFromUrl(TOKEN_KEYS)
  const isTempTokenExist = !isEmpty(TMP_TOKEN)
  const isStorageTokenExist = !!(tokenTypeFromStorage && accessTokenFromStorage)
  const isUrlSearchTokenExist = !!(tokenTypeFromUrl && accessTokenFromUrl)
  switch (true) {
    case isTempTokenExist: {
      Authorization = TMP_TOKEN
      break
    }
    case isStorageTokenExist: {
      Authorization = {
        [TOKEN_KEY.TOKEN_TYPE]: tokenTypeFromStorage,
        [TOKEN_KEY.ACCESS_TOKEN]: accessTokenFromStorage
      }
      TOKEN_KEYS.map((key) => window.localStorage.removeItem(key))
      break
    }
    case isUrlSearchTokenExist: {
      Authorization = {
        [TOKEN_KEY.TOKEN_TYPE]: tokenTypeFromUrl,
        [TOKEN_KEY.ACCESS_TOKEN]: accessTokenFromUrl
      }
      window.history.replaceState(null, '', window.location.pathname)
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
    TOKEN_KEYS.map((key) => window.localStorage.setItem(key, TMP_TOKEN[key]))
  }
}
window.addEventListener('beforeunload', beforeUnloadHandler)

const fetcher = async (config = {}, triggerArgs = {}) => {
  const [forceMock] = getSearchValuesFromUrl(['MOCK'])
  const isForceDisableMock = forceMock === '0'
  const { arg: { url: keyFromTrigger = '', ...body } = {} } = triggerArgs
  const { host = '', url: keyFromGet = '', options = {} } = config
  const { header = {}, ...restOptions } = options
  const key = keyFromGet || keyFromTrigger
  const url = `${host}${key}`
  const isHttpRequest = host.startsWith('http')
  const isAwsApi = key.startsWith(window.AWS_HOST_PREFIX)
  const isGetRequest = isEmpty(body)
  const authorization = getAuthorization()
  const newOptions = {
    headers: new Headers({
      'Content-type': 'application/json; charset=UTF-8',
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
        throw new Error('發生錯誤')
      }

      console.log(
        'Fetch data failed, mock mode will will using mock data instead.',
        { url, options, error: e.toString() }
      )
      return mockFetcher(key)
    })
}

export default fetcher
