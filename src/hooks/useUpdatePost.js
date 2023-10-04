import useSWRMutation from 'swr/mutation'
import { isEmpty } from 'lodash-es'

const host = window.IS_MOCK
  ? import.meta.env.VITE_LOCAL_MOCK_API_HOST
  : import.meta.env.VITE_MOCK_API_HOST

const useUpdatePost = (postData) => {
  const url = isEmpty(postData) ? null : '/posts/1'
  const options = {
    method: 'PUT',
    body: JSON.stringify(postData)
  }
  const {
    data = [], error, isLoading, isMutating, trigger
  } = useSWRMutation(() => ({ url, host, options }), { keepPreviousData: false })
  return {
    data,
    isLoading,
    isMutating,
    isError: error,
    trigger
  }
}

export default useUpdatePost
