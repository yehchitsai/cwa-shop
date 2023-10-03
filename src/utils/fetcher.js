const {
  VITE_MOCK_API_HOST
} = import.meta.env

const fetcher = async (key, options) => {
  const url = `${VITE_MOCK_API_HOST}${key}`
  return fetch(url, options)
    .then((res) => res.json())
}

export default fetcher
