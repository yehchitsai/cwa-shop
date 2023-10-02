const {
  VITE_MOCK_API_HOST
} = import.meta.env
const defaultOptions = {}
const fetcher = (url, options) => {
  return fetch(`${VITE_MOCK_API_HOST}${url}`, { ...defaultOptions, ...options })
    .then((res) => res.json())
}

export default fetcher
