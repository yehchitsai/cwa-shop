import getEntry from './getEntry'

const getEnvVar = (key) => {
  const isClient = typeof window === 'object'
  const isForceDisableMock = isClient
    ? (new URLSearchParams(window.location.search)).get('MOCK') === '0'
    : false
  if (isForceDisableMock) {
    return window.TARGET_ENV[key]
  }

  if (key === 'VITE_AWS_CHECK_AUTHORIZE') {
    const { isShop, isPurchase, isStaff } = getEntry()
    switch (true) {
      case isStaff:
      case isPurchase: {
        return window.CURRENT_ENV.VITE_AWS_CHECK_AUTHORIZE_PURCHASE_HOST
      }
      case isShop:
      default: {
        return window.CURRENT_ENV.VITE_AWS_CHECK_AUTHORIZE_SHOP_HOST
      }
    }
  }
  if (isClient) {
    return window.CURRENT_ENV[key]
  }
  return process.env[key]
}

export default getEnvVar
