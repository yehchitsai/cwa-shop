import { get } from 'lodash-es'
import useSWRMutation from 'swr/mutation'

const useUpdate = (host, customOptions = {}) => {
  const options = {
    method: 'put',
    ...customOptions
  }
  const {
    data: defaultData = [], error, isMutating, trigger
  } = useSWRMutation(() => ({ host, options }), { keepPreviousData: false })
  const data = get(defaultData, 'results', defaultData)
  return {
    data,
    isMutating,
    isError: error,
    trigger
  }
}

export default useUpdate
