import { removeTokens, clearTmpToken } from './fetcher'

const clearCookieMin35 = 1000 * 60 * 35
const clearExpiredLoginToken = () => {
  setTimeout(() => {
    removeTokens()
    clearTmpToken()
  }, clearCookieMin35)
}

export default clearExpiredLoginToken
