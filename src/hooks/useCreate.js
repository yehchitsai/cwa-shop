import { get } from 'lodash-es'
import useSWRMutation from 'swr/mutation'

const useCreate = (host) => {
  const options = {
    method: 'POST'
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

export default useCreate
