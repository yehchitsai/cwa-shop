import useSWR from 'swr'
import qs from 'query-string'
import { isEmpty } from 'lodash-es'
import fetcher from '../utils/fetcher'

const useFishInfo = (itemSerial) => {
  const params = { itemSerial }
  const url = `/v1/battafish?${qs.stringify(params)}`
  const { data = [], error, isLoading } = useSWR(isEmpty(itemSerial) ? null : url, fetcher)
  return {
    data,
    isLoading,
    isError: error
  }
}

export default useFishInfo
