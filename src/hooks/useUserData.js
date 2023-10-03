import useSWR from 'swr'

const useGithubRepo = () => {
  const { data = [], error, isLoading } = useSWR('/users')
  return {
    data,
    isLoading,
    isError: error
  }
}

export default useGithubRepo
