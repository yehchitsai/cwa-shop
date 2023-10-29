const getApiHost = (key) => {
  const isForceDisableMock = (new URLSearchParams(window.location.search)).get('mock') === '1'
  if (isForceDisableMock) {
    return window.TARGET_ENV[key]
  }

  return import.meta.env[key]
}

export default getApiHost
