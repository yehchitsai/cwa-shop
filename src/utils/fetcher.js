import { isEmpty } from 'lodash-es'
import mockFetcher from './mockFetcher'

const fetcher = async (config = {}, triggerArgs = {}) => {
  const urlSearch = new URLSearchParams(window.location.search)
  const [tokenType, accessToken] = ['token_type', 'access_token'].map((key) => urlSearch.get(key))
  const isForceDisableMock = urlSearch.get('MOCK') === '0'
  const { arg: { url: keyFromTrigger = '', ...body } = {} } = triggerArgs
  const { host = '', url: keyFromGet = '', options = {} } = config
  const { header = {}, ...restOptions } = options
  const key = keyFromGet || keyFromTrigger
  const url = `${host}${key}`
  const isHttpRequest = host.startsWith('http')
  const isAwsApi = key.startsWith(window.AWS_HOST_PREFIX)
  const isGetRequest = isEmpty(body)
  const newOptions = {
    headers: new Headers({
      'Content-type': 'application/json; charset=UTF-8',
      Authorization: `${tokenType} ${accessToken}`,
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
        throw e
      }

      console.log(
        'Fetch data failed, mock mode will will using mock data instead.',
        { url, options, error: e.toString() }
      )
      return mockFetcher(key)
    })
}

export default fetcher
