import useSWR from 'swr'
import qs from 'query-string'
import { isEmpty } from 'lodash-es'

const useFishData = (fishType) => {
  const params = { fishType }
  const url = `/v1/battafish?${qs.stringify(params)}`
  const { data = [], error, isLoading } = useSWR(() => {
    return isEmpty(fishType) ? null : url
  })
  return {
    data,
    isLoading,
    isError: error
  }
}

export default useFishData
