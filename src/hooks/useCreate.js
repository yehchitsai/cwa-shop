import { get } from 'lodash-es'
import useSWRMutation from 'swr/mutation'

const useCreate = (host, customOptions = {}, swrOptions = {}) => {
  const { isOriginData } = customOptions
  const options = {
    method: 'post',
    ...customOptions
  }
  const {
    data: defaultData = [], error, isMutating, trigger
  } = useSWRMutation(() => ({ host, options }), { keepPreviousData: false, ...swrOptions })
  const data = isOriginData ? defaultData : get(defaultData, 'results', defaultData)
  const isFailResponse = get(defaultData, 'status') === 'fail'
  return {
    data,
    isMutating,
    isError: error || isFailResponse,
    trigger
  }
}

export default useCreate
