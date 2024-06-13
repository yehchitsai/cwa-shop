import useSWR from 'swr'
import qs from 'query-string'
import { get, isEmpty } from 'lodash-es'
import getApiHost from '../utils/getApiHost'
import getApiPrefix from '../utils/getApiPrefix'

const host = getApiHost('VITE_AWS_FISH_INFO_SHOP_HOST')
const awsHostPrefix = getApiPrefix()

const useFishData = (fishType) => {
  const params = { fishType }
  const url = isEmpty(fishType) ? null : `${awsHostPrefix}/bettafishinfo?${qs.stringify(params)}`
  const {
    data: defaultData = [], error, isLoading
  } = useSWR(() => ({ url, host }), { suspense: false })
  const data = get(defaultData, 'results', defaultData)
  return {
    data,
    isLoading,
    isError: error
  }
}

export default useFishData
