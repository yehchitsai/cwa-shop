import { useMemo } from 'react'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import qs from 'query-string'
import {
  get, isEmpty, isNull, omitBy
} from 'lodash-es'
import getEnvVar from '../utils/getEnvVar'
import getApiPrefix from '../utils/getApiPrefix'

const host = getEnvVar('VITE_AWS_COMMON_HOST')
const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)
const useCategoryInfo = (params, options = {}) => {
  const cleanParams = omitBy(params, (v, k) => {
    if (k === 'page') {
      return false
    }

    return isEmpty(v)
  })
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

const getKey = (cleanParams) => (pageIndex) => {
  const cleanQs = isEmpty(cleanParams) ? '' : `&${qs.stringify(cleanParams)}`
  const qsStr = `?page=${pageIndex}${cleanQs}`
  const url = `${awsHostPrefix}/categoryinfo${qsStr}`
  const key = JSON.stringify({ url, host })
  return key
}

export const useCategoryInfoPages = (params, options = {}) => {
  const cleanParams = useMemo(() => omitBy(params, isEmpty), [params])

  const {
    data, error, isValidating, isLoading, ...rest
  } = useSWRInfinite(isEmpty(cleanParams) ? null : getKey(cleanParams), {
    suspense: false, revalidateFirstPage: false, ...options
  })
  return {
    data,
    isLoading: isValidating || isLoading,
    isError: error,
    ...rest
  }
}

export default useCategoryInfo
