import useSWR from 'swr'

const host = window.IS_MOCK
  ? import.meta.VITE_LOCAL_MOCK_API_HOST
  : import.meta.VITE_MOCK_API_HOST

const useUserData = () => {
  const { data = [], error, isLoading } = useSWR(() => ({ url: '/users', host }))
  return {
    data,
    isLoading,
    isError: error
  }
}

export default useUserData
