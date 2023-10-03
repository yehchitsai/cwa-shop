const {
  VITE_MOCK_API_HOST
} = import.meta.env

const fetcher = (url, options) => {
  return fetch(`${VITE_MOCK_API_HOST}${url}`, options)
    .then((res) => res.json())
}

export default fetcher
