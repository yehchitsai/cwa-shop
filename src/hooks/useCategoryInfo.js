import {
  useEffect, useMemo, useRef, useState
} from 'react'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import qs from 'query-string'
import {
  delay,
  get, isEmpty, isEqual, isNull, omitBy
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

const getKey = (cleanParams) => (pageIndex) => {
  if (isNull(cleanParams)) {
    return null
  }

  const cleanQs = isEmpty(cleanParams) ? '' : `&${qs.stringify(cleanParams)}`
  const qsStr = `?page=${pageIndex}${cleanQs}`
  const url = `${awsHostPrefix}/categoryinfo${qsStr}`
  const key = JSON.stringify({ url, host })
  return key
}

export const useCategoryInfoPages = (params, options = {}) => {
  const memRef = useRef(null)
  const [stateParams, setStateParams] = useState(null)
  const cleanParams = useMemo(() => omitBy(params, isEmpty), [params])

  useEffect(() => {
    if (isEqual(cleanParams, memRef.current)) {
      return
    }

    memRef.current = cleanParams
    delay(() => {
      setStateParams(cleanParams)
    }, 100)
  }, [cleanParams, stateParams])

  const {
    data, error, isValidating, isLoading, ...rest
  } = useSWRInfinite(getKey(stateParams), {
    suspense: false,
    revalidateFirstPage: false,
    parallel: true,
    ...options
  })
  return {
    data,
    isLoading: isValidating || isLoading,
    isError: error,
    ...rest
  }
}

export default useCategoryInfo
