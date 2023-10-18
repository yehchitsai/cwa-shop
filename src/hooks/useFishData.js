import useSWR from 'swr'
import qs from 'query-string'
import { isEmpty } from 'lodash-es'

const host = import.meta.env.VITE_AWS_DYNAMIC_HOST3

const useFishData = (fishType) => {
  const params = { fishType }
  const url = isEmpty(fishType) ? null : `/v1/battafish?${qs.stringify(params)}`
  const {
    data = [], error, isLoading
  } = useSWR(() => ({ url, host }), { suspense: true })
  return {
    data,
    isLoading,
    isError: error
  }
}

export default useFishData
