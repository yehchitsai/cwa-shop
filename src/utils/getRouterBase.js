const getRouterBase = (baseName) => {
  const base = (
    window.APP_BASENAME === '' &&
    window.IS_PROD &&
    !window.IS_PREVIEW
  ) ? '/' : baseName
  return base
}

export default getRouterBase
