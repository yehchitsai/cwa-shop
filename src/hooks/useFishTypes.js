import useSWR from 'swr'
import qs from 'query-string'
import { isEmpty, keyBy } from 'lodash-es'

const host = import.meta.env.VITE_AWS_DYNAMIC_HOST1

const useFishTypes = (lang) => {
  const params = { lang }
  const url = isEmpty(lang) ? null : `/v1/battafish?${qs.stringify(params)}`
  const {
    data = [], error, isLoading
  } = useSWR(() => ({ url, host }), { suspense: true })
  const fishTypes = isEmpty(data) ? [] : data.map((item) => {
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
