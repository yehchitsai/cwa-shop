import useSWR from 'swr'
import qs from 'query-string'
import {
  get, isEmpty, isNull, omitBy
} from 'lodash-es'
import getEnvVar from '../utils/getEnvVar'
import getApiPrefix from '../utils/getApiPrefix'

const host = getEnvVar('VITE_AWS_GET_CATEGORY_INFO_PURCHASE_HOST')
const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)
const useCategoryInfo = (params, options = {}) => {
  const cleanParams = omitBy(params, isEmpty)
  const isSkip = isNull(cleanParams)
  const qsStr = isSkip ? '' : `?${qs.stringify(cleanParams)}`
  const url = `${awsHostPrefix}/categoryinfo${qsStr}`
  const {
    data: defaultData = [], error, isValidating, isLoading
  } = useSWR(() => (isSkip ? null : ({ url, host })), { suspense: false, ...options })
  const data = get(defaultData, 'results', defaultData)
  return {
    data,
    isLoading: isValidating || isLoading,
    isError: error
  }
}

export default useCategoryInfo
