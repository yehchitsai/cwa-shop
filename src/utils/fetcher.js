import mockFetcher from './mockFetcher'

const {
  VITE_MOCK_API_HOST
} = import.meta.env

const fetcher = async (key, options) => {
  const url = `${VITE_MOCK_API_HOST}${key}`
  return fetch(url, options)
    .then((res) => {
      if (!res.ok) {
        throw new Error(res)
      }
      return res.json()
    })
    .catch((e) => {
      if (!window.IS_MOCK) {
        throw e
      }

      console.log(
        'Fetch data failed, mock mode will will using mock data instead.',
        { url, options, error: e.toString() }
      )
      return mockFetcher(url, options)
    })
}

export default fetcher
