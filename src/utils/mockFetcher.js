import qs from 'query-string'
import {
  find, delay, flow, concat, values, isEmpty
} from 'lodash-es'
import getSearchValuesFromUrl from './getSearchValuesFromUrl'

const defaultMockData = flow(
  () => import.meta.glob('../mock/**/*.js', { eager: true }),
  values,
  (modules) => concat(...modules.map((module) => module.default))
)()

let cachedMockData = []
const getMockData = () => {
  if (!isEmpty(cachedMockData)) {
    return cachedMockData
  }

  cachedMockData = defaultMockData.map(({ url, ...item }) => {
    return {
      ...item,
      url: url.replace('undefined/', `${window.TARGET_ENV.VITE_AWS_HOST_PREFIX}/`)
    }
  })
  return cachedMockData
}

const mockFetcher = async (key, authorization = {}, options = {}) => {
  const [forceDebug] = getSearchValuesFromUrl(['DEBUG'])
  // prod build mock data 拿不到 Vite env variable
  // 所以額外在 mock 時判斷有 undefined 取代掉
  const mockData = getMockData()
  const [endpoint, queryString] = key.split('?')
  const { data: body, method = 'get' } = options
  const {
    response = () => [],
    timeout = 0
  } = find(mockData, (item) => {
    return (
      // item.url.replace(/:.*/, '').includes(endpoint)
      (item.url === endpoint) &&
      (item.method === method)
    )
  }) || {}
  const resp = new Promise((resolve) => {
    delay(() => {
      const headers = {
        authorization: authorization.Authorization
      }
      const data = response({ query: qs.parse(queryString), headers, body })
      forceDebug && console.log({ apiEndpoint: key, responseData: data, body })
      resolve(data)
    }, timeout)
  })
  return resp
}

export default mockFetcher
