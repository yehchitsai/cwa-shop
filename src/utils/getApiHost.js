import getEntry from './getEntry'

const getApiHost = (key) => {
  const isForceDisableMock = (new URLSearchParams(window.location.search)).get('MOCK') === '0'
  if (isForceDisableMock) {
    return window.TARGET_ENV[key]
  }

  if (key === 'VITE_AWS_CHECK_AUTHORIZE') {
    const { isShop, isPurchase } = getEntry()
    switch (true) {
      case isPurchase: {
        return import.meta.env.VITE_AWS_CHECK_AUTHORIZE_PURCHASE
      }
      case isShop:
      default: {
        return import.meta.env.VITE_AWS_CHECK_AUTHORIZE_SHOP
      }
    }
  }
  return import.meta.env[key]
}

export default getApiHost
