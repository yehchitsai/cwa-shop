import { get } from 'lodash-es'
import useSWRMutation from 'swr/mutation'

const useUpdate = (host) => {
  const options = {
    method: 'PUT'
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
