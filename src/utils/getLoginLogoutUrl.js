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
  staff: {
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
  }
}
const getLoginLogoutUrl = (location = window.location) => {
  let entry = window.ENTRY_PATH.replace('/', '')
  const isMock = window.IS_MOCK
  if (entry === '') {
    entry = (
      (
        (window.IS_GH_PAGE)
          ? location.pathname.split('/')[1]
          : window.ENTRY_PATH.replace('/', '')
      ) ||
      'external'
    )
  }
  if (isMock) {
    const url = `login/?to=${location.pathname}`
    return { loginUrl: url, logoutUrl: url }
  }

  const { login, logout } = mappingByEntry[entry] || {}
  const loginUrl = import.meta.env[login]
  const logoutUrl = import.meta.env[logout]
  return { loginUrl, logoutUrl }
}

export default getLoginLogoutUrl
