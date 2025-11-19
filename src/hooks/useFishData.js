import useSWR from 'swr'
import qs from 'query-string'
import { get, isEmpty } from 'lodash-es'
import getEnvVar from '../utils/getEnvVar'
import getApiPrefix from '../utils/getApiPrefix'

const host = getEnvVar('VITE_AWS_COMMON_HOST')
const subPrefix = getEnvVar('VITE_AWS_SHOP_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)

const useFishData = (fishType) => {
  const params = { fishType }
  const url = isEmpty(fishType) ? null : `${awsHostPrefix}/bettafishinfo?${qs.stringify(params)}`
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

export default useFishData
