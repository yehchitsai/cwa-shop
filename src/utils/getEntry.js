const shopPaths = ['/external', '/external-demo', '/internal']
const purchasePaths = ['/purchase-domestic', '/purchase-export']
const staffPaths = ['/staff']
const pathsList = [shopPaths, purchasePaths, staffPaths]

const getEntry = (location = window.location) => {
  const isDev = window.ENTRY_PATH === '/'
  const [isShop, isPurchase, isStaff] = pathsList.map((targetPaths) => {
    return (
      (isDev && targetPaths.some((shopPath) => location.pathname.startsWith(shopPath))) ||
      (!isDev && targetPaths.includes(window.ENTRY_PATH))
    )
  })
  return {
    isDev,
    isShop,
    isPurchase,
    isStaff
  }
}

export default getEntry
