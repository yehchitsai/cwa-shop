import useSWRMutation from 'swr/mutation'
import qs from 'query-string'
import { get, isEmpty } from 'lodash-es'
import getEnvVar from '../utils/getEnvVar'
import getApiPrefix from '../utils/getApiPrefix'

const host = getEnvVar('VITE_AWS_FISH_SERIAL_INFO_SHOP_HOST')
const awsHostPrefix = getApiPrefix()

const useFishInfo = (itemSerial) => {
  const params = { itemSerial }
  const url = isEmpty(itemSerial) ? null : `${awsHostPrefix}/bettafishserialinfo?${qs.stringify(params)}`
  const {
    data: defaultData = [], error, isLoading, isMutating, trigger
  } = useSWRMutation(() => ({ url, host }), { keepPreviousData: false })
  const data = get(defaultData, 'results', defaultData)
  return {
    data,
    isLoading,
    isMutating,
    isError: error,
    trigger
  }
}

export default useFishInfo
