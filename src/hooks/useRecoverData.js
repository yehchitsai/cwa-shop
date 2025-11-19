import useSWR from 'swr'
import qs from 'query-string'
import {
  isEmpty, isNull, omitBy
} from 'lodash-es'
import getEnvVar from '../utils/getEnvVar'
import getApiPrefix from '../utils/getApiPrefix'

const host = getEnvVar('VITE_AWS_COMMON_HOST')
const awsHostPrefix = getApiPrefix()
const useRecoverData = (params, options = {}) => {
  const cleanParams = omitBy(params, isEmpty)
  const isSkip = isNull(cleanParams)
  const qsStr = isSkip ? '' : `?${qs.stringify(cleanParams)}`
  const url = `${awsHostPrefix}/recoveredata${qsStr}`
  const {
    data, error, isValidating, isLoading
  } = useSWR(() => (isSkip ? null : ({ url, host })), { suspense: false, ...options })
  return {
    data,
    isLoading: isValidating || isLoading,
    isError: error
  }
}

export default useRecoverData
