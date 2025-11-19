import useSWR from 'swr'
import qs from 'query-string'
import { get, isEmpty } from 'lodash-es'
import getEnvVar from '../utils/getEnvVar'
import getApiPrefix from '../utils/getApiPrefix'

const host = getEnvVar('VITE_AWS_COMMON_HOST')
const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)
const useExportQueryInfo = (phrase) => {
  const params = { phrase }
  const qsStr = isEmpty(phrase) ? '' : `?${qs.stringify(params)}`
  const url = `${awsHostPrefix}/exportqueryinfo${qsStr}`
  const {
    data: defaultData = [], error, isValidating, isLoading
  } = useSWR(() => ({ url, host }), { suspense: false })
  const data = get(defaultData, 'results', defaultData)
  return {
    data,
    isLoading: isValidating || isLoading,
    isError: error
  }
}

export default useExportQueryInfo
