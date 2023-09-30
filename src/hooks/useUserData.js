import useSWR from 'swr'
import fetcher from '../utils/fetcher'

const useGithubRepo = () => {
  const { data, error, isLoading } = useSWR('/api/users', fetcher)
  return {
    data,
    isLoading,
    isError: error
  }
}

export default useGithubRepo
