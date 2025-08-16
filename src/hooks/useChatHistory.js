import useSWR from 'swr'
import { get } from 'lodash-es'
import getEnvVar from '../utils/getEnvVar'
import getApiPrefix from '../utils/getApiPrefix'

const host = getEnvVar('VITE_AWS_GET_CATEGORY_INFO_PURCHASE_HOST')
const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)
const useChatHistory = (options = {}) => {
  const url = `${awsHostPrefix}/chathistory`
  const {
    data = [], error, isValidating, isLoading, mutate
  } = useSWR(() => ({ url, host }), { suspense: false, ...options })
  const history = get(data, 'records', [])

  const updateHistory = (results = []) => {
    const newData = [
      ...history,
      ...results
    ]
    return mutate(newData)
  }

  return {
    data: history,
    updateHistory,
    isLoading: isValidating || isLoading,
    isError: error
  }
}

export default useChatHistory
