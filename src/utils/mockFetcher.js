import qs from 'query-string'
import {
  find, delay, flow, concat, values
} from 'lodash-es'

const mockData = flow(
  () => import.meta.glob('../mock/**/*.js', { eager: true }),
  values,
  (modules) => concat(...modules.map((module) => module.default))
)()

const mockFetcher = async (args) => {
  const { url: key } = args
  const [endpoint, queryString] = key.split('?')
  const {
    response = () => [],
    timeout = 0
  } = find(mockData, (item) => item.url.includes(endpoint)) || {}
  const resp = new Promise((resolve) => {
    delay(() => {
      const data = response({ query: qs.parse(queryString) })
      console.log({ mockData: data })
      resolve(data)
    }, timeout)
  })
  return resp
}

export default mockFetcher
