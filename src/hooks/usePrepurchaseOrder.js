import useSWR from 'swr'
import { get } from 'lodash-es'
import getEnvVar from '../utils/getEnvVar'
import getApiPrefix from '../utils/getApiPrefix'

const host = getEnvVar('VITE_AWS_CREATE_PREPURCHASE_ORDER_PURCHASE_HOST')
const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)

const usePrepurchaseOrder = (options) => {
  const url = `${awsHostPrefix}/prepurchaseorder`
  const {
    data: defaultData = [], error, isValidating, isLoading
  } = useSWR(() => ({ url, host }), { suspense: false, ...options })
  const data = get(defaultData, 'results', defaultData)
  return {
    data,
    isLoading: isValidating || isLoading,
    isError: error
  }
}

export default usePrepurchaseOrder
