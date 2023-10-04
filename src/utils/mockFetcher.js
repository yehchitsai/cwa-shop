import qs from 'query-string'
import {
  find, delay
} from 'lodash-es'
// import {
//   find, delay, isEmpty, flow, concat, keys
// } from 'lodash-es'
import types from '../mock/battaFish/types'
import users from '../mock/jsonplaceholder/users'

const {
  VITE_MOCK_API_HOST
} = import.meta.env

// let cachedMockData = []
// const getMockData = async () => {
//   if (!isEmpty(cachedMockData)) {
//     return cachedMockData
//   }
//   const data = await flow(
//     () => import.meta.glob('../mock/**/*.js'),
//     async (mockFiles) => {
//       const paths = keys(mockFiles)
//       console.log({ mockFiles, paths })
//       return Promise
//         .all(paths.map((path) => {
//           const fileUrl = new URL(path, import.meta.url).href
//           console.log(fileUrl)
//           return import(/* @vite-ignore */path)
//         }))
//         .then((modules) => concat(...modules.map((module) => module.default)))
//     }
//   )()
//   cachedMockData = data
//   return data
// }

const mockFetcher = async (url) => {
  // await getMockData()
  const mockData = [...types, ...users]
  // console.log(mockData)
  const [endpoint, queryString] = url.replace(VITE_MOCK_API_HOST, '').split('?')
  const mock = find(mockData, (item) => item.url.includes(endpoint)) || {}
  const { response, timeout } = mock
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
