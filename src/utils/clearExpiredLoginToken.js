import { removeTokens, clearTmpToken } from './fetcher'

const clearCookieMin35 = 1000 * 60 * 35
const clearExpiredLoginToken = (forceClear = false) => {
  setTimeout(() => {
    removeTokens()
    clearTmpToken()
  }, forceClear ? 0 : clearCookieMin35)
}

export default clearExpiredLoginToken
