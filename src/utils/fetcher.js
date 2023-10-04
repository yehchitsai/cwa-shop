import { flow, get, isUndefined } from 'lodash-es'
import mockFetcher from './mockFetcher'

const fetcher = async (args = {}) => {
  const { host, url: key, options = {} } = args
  const url = `${host}${key}`
  const isHttpRequest = host.startsWith('http')
  const isAwsApi = key.startsWith('/v1')
  const isGetRequest = flow(
    () => get(options, 'body'),
    isUndefined
  )()
  const newOptions = {
    ...(!isGetRequest && {
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    }),
    ...options
  }
  const request = (!isHttpRequest && isAwsApi)
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
      const isMockAwsApi = (window.IS_MOCK_AWS_API && key.startsWith('/v1'))
      if (!window.IS_MOCK && !isMockAwsApi) {
        throw e
      }

      console.log(
        'Fetch data failed, mock mode will will using mock data instead.',
        { url, options, error: e.toString() }
      )
      return mockFetcher(args)
    })
}

export default fetcher
