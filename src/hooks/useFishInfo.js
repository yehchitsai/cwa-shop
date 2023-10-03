import useSWRMutation from 'swr/mutation'
import qs from 'query-string'
import { isEmpty } from 'lodash-es'

const useFishInfo = (itemSerial) => {
  const params = { itemSerial }
  const url = `/v1/battafish?${qs.stringify(params)}`
  const {
    data = [], error, isLoading, isMutating, trigger
  } = useSWRMutation(() => {
    return isEmpty(itemSerial) ? null : url
  }, { keepPreviousData: false })
  return {
    data,
    isLoading,
    isMutating,
    isError: error,
    trigger
  }
}

export default useFishInfo
