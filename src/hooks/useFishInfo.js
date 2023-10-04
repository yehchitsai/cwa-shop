import useSWRMutation from 'swr/mutation'
import qs from 'query-string'
import { isEmpty } from 'lodash-es'

const host = import.meta.env.VITE_AWS_DYNAMIC_HOST2

const useFishInfo = (itemSerial) => {
  const params = { itemSerial }
  const url = isEmpty(itemSerial) ? null : `/v1/battafish?${qs.stringify(params)}`
  const {
    data = [], error, isLoading, isMutating, trigger
  } = useSWRMutation(() => ({ url, host }), { keepPreviousData: false })
  return {
    data,
    isLoading,
    isMutating,
    isError: error,
    trigger
  }
}

export default useFishInfo
