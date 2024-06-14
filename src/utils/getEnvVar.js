import getEntry from './getEntry'

const getEnvVar = (key) => {
  const isForceDisableMock = (new URLSearchParams(window.location.search)).get('MOCK') === '0'
  if (isForceDisableMock) {
    return window.TARGET_ENV[key]
  }

  if (key === 'VITE_AWS_CHECK_AUTHORIZE') {
    const { isShop, isPurchase } = getEntry()
    switch (true) {
      case isPurchase: {
        return import.meta.env.VITE_AWS_CHECK_AUTHORIZE_PURCHASE_HOST
      }
      case isShop:
      default: {
        return import.meta.env.VITE_AWS_CHECK_AUTHORIZE_SHOP_HOST
      }
    }
  }
  return import.meta.env[key]
}

export default getEnvVar
