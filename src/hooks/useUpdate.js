import useSWRMutation from 'swr/mutation'

const useUpdatePost = (host) => {
  const options = {
    method: 'PUT'
  }
  const {
    data = [], error, isMutating, trigger
  } = useSWRMutation(() => ({ host, options }), { keepPreviousData: false })
  return {
    data,
    isMutating,
    isError: error,
    trigger
  }
}

export default useUpdatePost
