import useSWR from 'swr'
import qs from 'query-string'
import { isEmpty, keyBy } from 'lodash-es'
import fetcher from '../utils/fetcher'

const useFishTypes = (lang) => {
  const params = { lang }
  const url = `/v1/battafish?${qs.stringify(params)}`
  const { data = [], error, isLoading } = useSWR(isEmpty(lang) ? null : url, fetcher)
  const fishTypes = data.map((item) => {
    const {
      fishType, fishName, scientificName, fishPrice
    } = item
    return {
      ...item,
      label: `${fishName} (${scientificName}) ${fishPrice}`,
      value: fishType
    }
  })
  const fishTypeMap = keyBy(fishTypes, 'value')
  return {
    data,
    fishTypes,
    fishTypeMap,
    isLoading,
    isError: error
  }
}

export default useFishTypes
