const mappingByEntry = {
  external: {
    login: 'VITE_LOGIN_URL_EXTERNAL',
    logout: 'VITE_LOGOUT_URL_EXTERNAL'
  },
  'external-demo': {
    login: 'VITE_LOGIN_URL_EXTERNAL_DEMO',
    logout: 'VITE_LOGOUT_URL_EXTERNAL_DEMO'
  },
  internal: {
    login: 'VITE_LOGIN_URL_INTERNAL',
    logout: 'VITE_LOGOUT_URL_INTERNAL'
  },
  demo: {
    login: 'VITE_LOGIN_URL_INTERNAL',
    logout: 'VITE_LOGOUT_URL_INTERNAL'
  },
  'purchase-domestic': {
    login: 'VITE_LOGIN_URL_PURCHASE_DOMESTIC',
    logout: 'VITE_LOGOUT_URL_PURCHASE_DOMESTIC'
  },
  'purchase-export': {
    login: 'VITE_LOGIN_URL_PURCHASE_EXPORT',
    logout: 'VITE_LOGOUT_URL_PURCHASE_EXPORT'
  },
  'purchase-internal': {
    login: 'VITE_LOGIN_URL_PURCHASE_INTERNAL',
    logout: 'VITE_LOGOUT_URL_PURCHASE_INTERNAL'
  }
}
const getLoginLogoutUrl = () => {
  let entry = window.ENTRY_PATH.replace('/', '')
  const isMock = window.IS_MOCK
  if (entry === '') {
    if (isMock) {
      const url = 'login/'
      return { loginUrl: url, logoutUrl: url }
    }
    entry = 'external'
  }

  const { login, logout } = mappingByEntry[entry]
  const loginUrl = import.meta.env[login]
  const logoutUrl = import.meta.env[logout]
  return { loginUrl, logoutUrl }
}

export default getLoginLogoutUrl
