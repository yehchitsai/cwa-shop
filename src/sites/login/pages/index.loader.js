import { removeTokens, clearTmpToken } from '../../../utils/fetcher'

const loader = () => {
  removeTokens()
  clearTmpToken()
  return null
}

export default loader
