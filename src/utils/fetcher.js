const {
  DEV,
  VITE_MOCK_API_HOST
} = import.meta.env
const host = DEV ? '' : VITE_MOCK_API_HOST
const fetcher = (url, ...args) => fetch(`${host}${url}`, ...args).then((res) => res.json())

export default fetcher
