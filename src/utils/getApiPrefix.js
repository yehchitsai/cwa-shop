const getApiPrefix = (subPrefix = '') => {
  let apiPrefix
  if (typeof window === 'object') {
    apiPrefix = window.AWS_HOST_PREFIX
  } else {
    apiPrefix = process.env.VITE_AWS_HOST_PREFIX
  }
  return `${apiPrefix}${subPrefix}`
}

export default getApiPrefix
