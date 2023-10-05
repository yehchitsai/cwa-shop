import useSWRMutation from 'swr/mutation'

const useCreatePost = (host) => {
  const options = {
    method: 'POST'
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

export default useCreatePost
