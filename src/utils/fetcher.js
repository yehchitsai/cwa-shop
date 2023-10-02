const {
  VITE_MOCK_API_HOST
} = import.meta.env
const fetcher = (url, ...args) => {
  return fetch(`${VITE_MOCK_API_HOST}${url}`, ...args).then((res) => res.json())
}

export default fetcher
