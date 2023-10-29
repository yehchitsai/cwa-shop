import useSWRMutation from 'swr/mutation'
import qs from 'query-string'
import { get, isEmpty } from 'lodash-es'
import getApiHost from '../utils/getApiHost'

const host = getApiHost('VITE_AWS_DYNAMIC_HOST3')
const awsHostPrefix = import.meta.env.VITE_AWS_HOST_PREFIX

const useFishInfo = (itemSerial) => {
  const params = { itemSerial }
  const url = isEmpty(itemSerial) ? null : `${awsHostPrefix}/bettafish?${qs.stringify(params)}`
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
