import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import qs from 'query-string'
import {
  get, isEmpty, isNull, isNumber, omitBy
} from 'lodash-es'
import getEnvVar from '../utils/getEnvVar'
import getApiPrefix from '../utils/getApiPrefix'

const host = getEnvVar('VITE_AWS_COMMON_HOST')
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

export const useCategoryInfoPages = (params, options = {}) => {
  const getKey = (pageIndex) => {
    const cleanParams = omitBy({ ...params, page: pageIndex }, (v) => {
      if (isNumber(v)) {
        return false
      }

      return isEmpty(v)
    })
    const qsStr = `?${qs.stringify(cleanParams)}`
    const url = `${awsHostPrefix}/categoryinfo${qsStr}`
    return { url, host }
  }

  const {
    data, error, isValidating, isLoading, ...rest
  } = useSWRInfinite(getKey, {
    suspense: false, revalidateFirstPage: false, parallel: true, ...options
  })
  return {
    data,
    isLoading: isValidating || isLoading,
    isError: error,
    ...rest
  }
}

export default useCategoryInfo
